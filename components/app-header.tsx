import Link from "next/link";
import type { Route } from "next";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PublicAccessLink, PublicHeaderLinks } from "@/components/public-header-links";
import { UserMenu } from "@/components/user-menu";
import { getUserHandle, getUserInitial } from "@/lib/user";

const privateNavItems = [
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
  const userLabel = userIdentity?.label ?? "Iniciar sesión";
  const userInitial = userIdentity?.initial ?? userLabel.slice(0, 1).toUpperCase();

  return (
    <header className="app-header">
      <div className="top-nav">
        {userEmail ? (
          <nav aria-label="Principal" className="top-nav-links">
            {privateNavItems.map((item) => (
              <Link className="nav-link" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <PublicHeaderLinks />
        )}

        <Link className="wordmark" href="/">
          MOODSCAPE
        </Link>

        <div className="top-nav-user">
          {userEmail ? (
            <UserMenu userEmail={userEmail} userInitial={userInitial} userLabel={userLabel} />
          ) : (
            <PublicAccessLink />
          )}
        </div>
      </div>
    </header>
  );
}
