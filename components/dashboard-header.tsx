import { logoutAction } from "@/app/login/actions";

type DashboardHeaderProps = {
  email: string;
};

export function DashboardHeader({ email }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <strong>Moodscape</strong>
        <p className="helper-text">Sesion iniciada como {email}</p>
      </div>

      <form action={logoutAction}>
        <button className="secondary-button" type="submit">
          Cerrar sesion
        </button>
      </form>
    </header>
  );
}
