import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function isMissingPkceVerifierError(message: string) {
  const normalizedMessage = message.toLocaleLowerCase("en-US");

  return (
    normalizedMessage.includes("pkce") ||
    normalizedMessage.includes("code verifier")
  );
}

/** Intercambia el código temporal de Supabase por una sesión y redirige a una ruta interna segura. */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const nextPath = next && next.startsWith("/") ? next : "/";

  if (code) {
    const supabase = await createServerSupabaseClient();
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

      const errorUrl = new URL("/login", requestUrl.origin);
      errorUrl.searchParams.set(
        "message",
        "No se ha podido completar el acceso. Inténtalo de nuevo."
      );
      errorUrl.searchParams.set("type", "error");

      return NextResponse.redirect(errorUrl);
    }
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
