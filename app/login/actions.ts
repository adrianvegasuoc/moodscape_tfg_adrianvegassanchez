"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { buildAuthRedirect } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Normalizamos los campos del formulario antes de enviarlos a Supabase.
function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

// Supabase necesita una URL absoluta para volver al proyecto tras confirmar email.
function getOriginFromHeaders(headersStore: Headers) {
  const origin = headersStore.get("origin");

  if (origin) {
    return origin;
  }

  const host = headersStore.get("x-forwarded-host") ?? headersStore.get("host");
  const protocol = headersStore.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

function buildPasswordRecoveryRedirectUrl(origin: string) {
  const redirectUrl = new URL("/auth/callback", origin);
  redirectUrl.searchParams.set("next", "/actualizar-password");

  return redirectUrl.toString();
}

const RECOVERY_SUCCESS_MESSAGE =
  "Si el email existe, recibirás instrucciones para restablecer tu contraseña.";

function isNonDisclosureRecoveryError(error: { message?: string; status?: number }) {
  const message = error.message?.toLocaleLowerCase("es-ES") ?? "";

  return error.status === 404 || message.includes("not found") || message.includes("not exist");
}

// Server Action del formulario de login.
// Se ejecuta en el servidor, valida los campos basicos y deja que Supabase cree la sesion.
export async function loginAction(formData: FormData) {
  // Leemos y limpiamos los valores enviados por el formulario HTML.
  const email = getStringValue(formData.get("email"));
  const password = getStringValue(formData.get("password"));

  if (!email || !password) {
    redirect(buildAuthRedirect("/login", "Completa email y contraseña.", "error"));
  }

  // Este cliente comparte el contexto de cookies de la peticion actual.
  const supabase = await createServerSupabaseClient();
  // Supabase valida las credenciales y, si son correctas, escribe la sesion en cookies.
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(buildAuthRedirect("/login", error.message, "error"));
  }

  // Revalidamos el layout para que los componentes server lean la sesion actualizada.
  revalidatePath("/", "layout");
  redirect("/" as Route);
}

// Server Action del formulario de registro.
// Crea el usuario en Supabase y define la URL a la que se volvera tras confirmar el email.
export async function registerAction(formData: FormData) {
  const email = getStringValue(formData.get("email"));
  const password = getStringValue(formData.get("password"));

  if (!email || !password) {
    redirect(buildAuthRedirect("/register", "Completa email y contraseña.", "error"));
  }

  // Necesitamos conocer el origen actual para construir una URL absoluta de callback.
  const headersStore = await headers();
  const origin = getOriginFromHeaders(headersStore);
  const supabase = await createServerSupabaseClient();
  // emailRedirectTo indica a Supabase donde debe devolver al usuario al confirmar la cuenta.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    redirect(buildAuthRedirect("/register", error.message, "error"));
  }

  // Tras el alta, mostramos un mensaje simple y dejamos que el usuario confirme su correo si aplica.
  redirect(
    buildAuthRedirect(
      "/login",
      "Registro completado. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
      "success"
    )
  );
}

// Solicita a Supabase el envio del email de recuperacion sin revelar si la cuenta existe.
export async function recoverPasswordAction(formData: FormData) {
  const email = getStringValue(formData.get("email"));

  if (!email) {
    redirect(buildAuthRedirect("/recuperar-password", "Introduce tu email.", "error"));
  }

  const headersStore = await headers();
  const origin = getOriginFromHeaders(headersStore);
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildPasswordRecoveryRedirectUrl(origin)
  });

  if (error) {
    if (isNonDisclosureRecoveryError(error)) {
      redirect(buildAuthRedirect("/recuperar-password", RECOVERY_SUCCESS_MESSAGE, "success"));
    }

    console.error("Password recovery email failed", {
      message: error.message,
      name: error.name,
      status: error.status
    });

    redirect(
      buildAuthRedirect(
        "/recuperar-password",
        "No se ha podido enviar el correo. Inténtalo de nuevo.",
        "error"
      )
    );
  }

  redirect(
    buildAuthRedirect("/recuperar-password", RECOVERY_SUCCESS_MESSAGE, "success")
  );
}

// Guarda una nueva contraseña tras abrir el enlace de recuperacion y crear la sesion temporal.
export async function updateRecoveredPasswordAction(formData: FormData) {
  const password = getStringValue(formData.get("password"));

  if (!password) {
    redirect(buildAuthRedirect("/actualizar-password", "Introduce tu nueva contraseña.", "error"));
  }

  if (password.length < 6) {
    redirect(
      buildAuthRedirect(
        "/actualizar-password",
        "La nueva contraseña debe tener al menos 6 caracteres.",
        "error"
      )
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      buildAuthRedirect(
        "/recuperar-password",
        "Abre de nuevo el enlace de recuperación o solicita otro correo.",
        "error"
      )
    );
  }

  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirect(
      buildAuthRedirect(
        "/actualizar-password",
        "No se ha podido actualizar la contraseña. Inténtalo de nuevo.",
        "error"
      )
    );
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(buildAuthRedirect("/login", "Contraseña actualizada. Inicia sesión de nuevo.", "success"));
}

// El logout borra la sesion actual de Supabase y actualiza la UI del lado servidor.
export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(buildAuthRedirect("/login", "Sesion cerrada correctamente.", "success"));
}
