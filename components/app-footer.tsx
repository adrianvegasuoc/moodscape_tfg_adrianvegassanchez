import Link from "next/link";
import type { Route } from "next";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const privateFooterLinks = [
  { href: "/explorar" as Route, label: "Explorar" },
  { href: "/mi-mapa-emocional" as Route, label: "Mis creaciones" }
];

const publicFooterLinks = [
  { href: "/descubre-moodscape" as Route, label: "Descubre Moodscape" },
  { href: "/login" as Route, label: "Iniciar sesión" }
];

async function hasCurrentUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return Boolean(user);
  } catch {
    return false;
  }
}

export async function AppFooter() {
  // El footer evita exponer enlaces privados cuando todavía no existe sesión.
  const footerLinks = (await hasCurrentUser()) ? privateFooterLinks : publicFooterLinks;

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div>
          <strong>Moodscape</strong>
          <p>Expresión emocional mediante arte generativo</p>
        </div>

        <p className="app-footer-credit">TFG · Adrián Vegas Sánchez</p>

        <nav aria-label="Pie de pagina" className="app-footer-links">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
