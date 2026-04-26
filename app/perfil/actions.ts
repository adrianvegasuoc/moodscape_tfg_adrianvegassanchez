"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { getUpdatedUserMetadata } from "@/lib/user";

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeUsername(value: string) {
  return value.replace(/^@+/, "").trim().toLowerCase();
}

function buildProfileRedirect(message: string, type: "error" | "success") {
  const params = new URLSearchParams({
    message,
    type
  });

  return `/perfil?${params.toString()}` as Route;
}

// Este flujo mantiene el perfil simple: metadata para el nick y reautenticacion
// por password actual antes de permitir un cambio de clave.
export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await requireAuthenticatedUser();
  const username = sanitizeUsername(getStringValue(formData.get("username")));
  const currentPassword = getStringValue(formData.get("current_password"));
  const newPassword = getStringValue(formData.get("new_password"));
  const isPasswordChangeRequested = Boolean(currentPassword || newPassword);

  if (!username) {
    redirect(buildProfileRedirect("Introduce un nick de usuario valido.", "error"));
  }

  if (!/^[a-z0-9._-]{3,24}$/.test(username)) {
    redirect(
      buildProfileRedirect(
        "El nick debe tener entre 3 y 24 caracteres y solo usar letras, numeros, puntos, guiones o guion bajo.",
        "error"
      )
    );
  }

  if (isPasswordChangeRequested && (!currentPassword || !newPassword)) {
    redirect(
      buildProfileRedirect(
        "Para cambiar la contraseña debes completar la contraseña actual y la nueva.",
        "error"
      )
    );
  }

  if (newPassword && newPassword.length < 8) {
    redirect(buildProfileRedirect("La nueva contraseña debe tener al menos 8 caracteres.", "error"));
  }

  if (isPasswordChangeRequested) {
    if (!user.email) {
      redirect(buildProfileRedirect("No se pudo validar tu email actual.", "error"));
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      redirect(buildProfileRedirect("La contraseña actual no es correcta.", "error"));
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: getUpdatedUserMetadata(user, username),
    ...(newPassword ? { password: newPassword } : {})
  });

  if (updateError) {
    redirect(buildProfileRedirect(updateError.message, "error"));
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/perfil");
  redirect(buildProfileRedirect("Perfil actualizado correctamente.", "success"));
}
