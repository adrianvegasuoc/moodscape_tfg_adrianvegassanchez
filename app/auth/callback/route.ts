import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function isMissingPkceVerifierError(message: string) {
  const normalizedMessage = message.toLocaleLowerCase("en-US");

  return (
    normalizedMessage.includes("pkce") ||
    normalizedMessage.includes("code verifier")
  );
}

// Supabase redirige aqui despues de confirmar email o de completar el flujo OAuth/magic link.
// El objetivo de esta ruta es convertir el "code" recibido en una sesion real de Supabase.
export async function GET(request: Request) {
  // Convertimos la URL de la peticion en un objeto facil de consultar.
  const requestUrl = new URL(request.url);
  // Supabase envia este codigo temporal para poder recuperar la sesion del usuario.
  const code = requestUrl.searchParams.get("code");
  // "next" permite volver a una ruta concreta despues del login.
  const next = requestUrl.searchParams.get("next");
  // Solo aceptamos rutas internas para evitar redirecciones abiertas.
  const nextPath = next && next.startsWith("/") ? next : "/";

  if (code) {
    // Creamos un cliente server-side porque el intercambio del codigo debe hacerse en servidor.
    const supabase = await createServerSupabaseClient();
    // Esta llamada guarda la sesion resultante en cookies.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback failed", {
        message: error.message,
        name: error.name,
        status: error.status
      });

      if (isMissingPkceVerifierError(error.message)) {
        return NextResponse.redirect(new URL("/login", requestUrl.origin));
      }

      // Si falla el intercambio, evitamos exponer detalles tecnicos de Supabase en UI.
      const errorUrl = new URL("/login", requestUrl.origin);
      errorUrl.searchParams.set(
        "message",
        "No se ha podido completar el acceso. Inténtalo de nuevo."
      );
      errorUrl.searchParams.set("type", "error");

      return NextResponse.redirect(errorUrl);
    }
  }

  // Si todo sale bien, el usuario entra en la ruta final con la sesion ya persistida.
  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
