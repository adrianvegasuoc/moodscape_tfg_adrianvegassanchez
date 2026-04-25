import Link from "next/link";
import type { Route } from "next";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/" as Route, label: "Inicio" },
  { href: "/explorar" as Route, label: "Explorar" }
];

async function getCurrentUserEmail() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return user?.email ?? null;
  } catch {
    return null;
  }
}

export async function AppHeader() {
  const userEmail = await getCurrentUserEmail();
  const userLabel = userEmail ? userEmail.split("@")[0] : "Acceder";
  const userInitial = userLabel.slice(0, 1).toUpperCase();

  return (
    <header className="app-header">
      <div className="top-nav">
        <nav aria-label="Principal" className="top-nav-links">
          {navItems.map((item) => (
            <Link className="nav-link" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="wordmark" href="/">
          MOODSCAPE
        </Link>

        <div className="top-nav-user">
          {userEmail ? (
            <Link className="user-link" href="/perfil" title={userEmail}>
              <span className="user-name">{userLabel}</span>
              <span aria-hidden="true" className="user-avatar">
                {userInitial}
              </span>
            </Link>
          ) : (
            <Link className="user-link" href="/login">
              <span className="user-name">{userLabel}</span>
              <span aria-hidden="true" className="user-avatar">
                {userInitial}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
