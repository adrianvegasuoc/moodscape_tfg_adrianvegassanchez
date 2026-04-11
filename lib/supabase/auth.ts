import type { Route } from "next";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type AuthPagePath = "/login" | "/register";

// Reutilizamos este guard en las paginas publicas para sacar de ahi a usuarios ya autenticados.
export async function redirectIfAuthenticated() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard" as Route);
  }
}

// Este guard centraliza la proteccion de rutas privadas como dashboard.
export async function requireAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Debes%20iniciar%20sesion%20para%20continuar.&type=error" as Route);
  }

  return { supabase, user };
}

// Los mensajes via query params mantienen la UI simple sin estado cliente extra.
export function buildAuthRedirect(path: AuthPagePath, message: string, type: "error" | "success") {
  const params = new URLSearchParams({
    message,
    type
  });

  return `${path}?${params.toString()}` as Route;
}
