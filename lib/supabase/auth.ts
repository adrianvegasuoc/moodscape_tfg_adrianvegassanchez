import type { Route } from "next";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type AuthPagePath = "/actualizar-password" | "/login" | "/recuperar-password" | "/register";
type RequireAuthenticatedUserOptions = {
  redirectTo?: Route;
  showLoginMessage?: boolean;
};

/** Redirige a la Home privada cuando un usuario con sesión visita una página pública. */
export async function redirectIfAuthenticated() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/" as Route);
  }
}

/** Protege rutas privadas y devuelve el usuario junto al cliente Supabase autenticado. */
export async function requireAuthenticatedUser(options: RequireAuthenticatedUserOptions = {}) {
  const { redirectTo = "/descubre-moodscape" as Route, showLoginMessage = false } = options;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    if (redirectTo !== "/login" || !showLoginMessage) {
      redirect(redirectTo);
    }

    redirect("/login?message=Debes%20iniciar%20sesion%20para%20continuar.&type=error" as Route);
  }

  return { supabase, user };
}

/** Construye redirecciones de autenticación con mensajes serializados en query params. */
export function buildAuthRedirect(path: AuthPagePath, message: string, type: "error" | "success") {
  const params = new URLSearchParams({
    message,
    type
  });

  return `${path}?${params.toString()}` as Route;
}
