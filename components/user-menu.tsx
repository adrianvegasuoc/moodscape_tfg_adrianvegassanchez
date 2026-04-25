import Link from "next/link";
import type { Route } from "next";

import { logoutAction } from "@/app/login/actions";

type UserMenuProps = {
  userEmail: string;
  userInitial: string;
  userLabel: string;
};

export function UserMenu({ userEmail, userInitial, userLabel }: UserMenuProps) {
  return (
    <details className="user-menu">
      <summary className="user-link user-menu-trigger" title={userEmail}>
        <span className="user-name">{userLabel}</span>
        <span aria-hidden="true" className="user-avatar">
          {userInitial}
        </span>
        <span aria-hidden="true" className="user-menu-chevron">
          ▾
        </span>
      </summary>

      <div className="user-menu-panel">
        <Link className="user-menu-item" href={"/perfil" as Route}>
          Ir al perfil
        </Link>

        <form action={logoutAction}>
          <button className="user-menu-item user-menu-button" type="submit">
            Cerrar sesion
          </button>
        </form>
      </div>
    </details>
  );
}
