import { DashboardHeader } from "@/components/dashboard-header";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";

// Dashboard es una pagina privada: solo debe renderizarse con un usuario autenticado.
export default async function DashboardPage() {
  // Si no hay sesion, este helper redirige automaticamente a login.
  const { user } = await requireAuthenticatedUser();

  return (
    <main className="page-shell">
      {/* Header minimo con email del usuario y accion de cierre de sesion. */}
      <DashboardHeader email={user.email ?? "usuario"} />

      <section className="landing">
        <h1>Dashboard</h1>
        <p>
          Esta es la zona protegida de Moodscape. La sesion persiste mediante Supabase y ya
          puedes usar esta base para continuar con el resto del MVP.
        </p>
      </section>
    </main>
  );
}
