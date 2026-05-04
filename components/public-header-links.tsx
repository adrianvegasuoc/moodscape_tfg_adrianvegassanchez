"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const discoverHref = "/descubre-moodscape" as Route;
const discoverHowItWorksHref = "/descubre-moodscape#como-funciona" as Route;
const loginHref = "/login" as Route;

export function PublicHeaderLinks() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return (
      <nav aria-label="Principal" className="top-nav-links">
        <Link className="nav-link" href={discoverHref}>
          Descubre Moodscape
        </Link>
      </nav>
    );
  }

  if (pathname === "/descubre-moodscape") {
    return (
      <nav aria-label="Principal" className="top-nav-links">
        <Link className="nav-link" href={loginHref}>
          Iniciar sesión
        </Link>
      </nav>
    );
  }

  return (
    <nav aria-label="Principal" className="top-nav-links">
      <Link className="nav-link" href={discoverHref}>
        Descubre Moodscape
      </Link>
      <Link className="nav-link" href={discoverHowItWorksHref}>
        Cómo funciona
      </Link>
    </nav>
  );
}

export function PublicAccessLink() {
  const pathname = usePathname();

  if (pathname === "/descubre-moodscape") {
    return null;
  }

  return (
    <Link className="user-link" href={loginHref}>
      <span className="user-name">Acceder</span>
      <span aria-hidden="true" className="user-avatar">
        A
      </span>
    </Link>
  );
}
