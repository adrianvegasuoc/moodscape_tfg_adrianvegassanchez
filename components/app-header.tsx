import Link from "next/link";
import type { Route } from "next";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/user-menu";
import { getUserHandle, getUserInitial } from "@/lib/user";

const navItems = [
  { href: "/" as Route, label: "Inicio" },
  { href: "/explorar" as Route, label: "Explorar" },
  { href: "/mi-mapa-emocional" as Route, label: "Mis creaciones" }
];

async function getCurrentUserIdentity() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return {
      email: user.email ?? "",
      initial: getUserInitial(user),
      label: getUserHandle(user)
    };
  } catch {
    return null;
  }
}

export async function AppHeader() {
  const userIdentity = await getCurrentUserIdentity();
  const userEmail = userIdentity?.email ?? null;
  const userLabel = userIdentity?.label ?? "Acceder";
  const userInitial = userIdentity?.initial ?? userLabel.slice(0, 1).toUpperCase();

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
            <UserMenu userEmail={userEmail} userInitial={userInitial} userLabel={userLabel} />
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
