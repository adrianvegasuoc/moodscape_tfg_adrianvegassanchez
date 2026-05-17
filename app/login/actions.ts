"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { buildAuthRedirect } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

/** Inicia sesión con email y contraseña y fuerza la relectura de la sesión en el layout. */
export async function loginAction(formData: FormData) {
  const email = getStringValue(formData.get("email"));
  const password = getStringValue(formData.get("password"));

  if (!email || !password) {
    redirect(buildAuthRedirect("/login", "Completa email y contraseña.", "error"));
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(buildAuthRedirect("/login", error.message, "error"));
  }

  revalidatePath("/", "layout");
  redirect("/" as Route);
}

/** Registra una cuenta y configura el callback de confirmación de email de Supabase. */
export async function registerAction(formData: FormData) {
  const email = getStringValue(formData.get("email"));
  const password = getStringValue(formData.get("password"));

  if (!email || !password) {
    redirect(buildAuthRedirect("/register", "Completa email y contraseña.", "error"));
  }

  const headersStore = await headers();
  const origin = getOriginFromHeaders(headersStore);
  const supabase = await createServerSupabaseClient();
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

  redirect(
    buildAuthRedirect(
      "/login",
      "Registro completado. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
      "success"
    )
  );
}

/** Solicita recuperación de contraseña sin revelar si el email existe en Supabase Auth. */
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

/** Actualiza la contraseña después de validar el enlace de recuperación y crear sesión temporal. */
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

/** Cierra la sesión en Supabase y revalida el layout para limpiar la navegación privada. */
export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(buildAuthRedirect("/login", "Sesion cerrada correctamente.", "success"));
}
