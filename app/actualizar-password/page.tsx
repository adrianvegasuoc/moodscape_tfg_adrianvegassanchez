import { redirect } from "next/navigation";

import { updateRecoveredPasswordAction } from "@/app/login/actions";
import { AuthMessage } from "@/components/auth-message";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { buildAuthRedirect } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type UpdatePasswordPageProps = {
  searchParams: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      buildAuthRedirect(
        "/recuperar-password",
        "Abre el enlace de recuperación o solicita otro correo.",
        "error"
      )
    );
  }

  const params = await searchParams;

  return (
    <main className="page-shell auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Moodscape</p>
        <h1>Crear nueva contraseña</h1>
        <p>Introduce una nueva contraseña para recuperar el acceso a tu cuenta.</p>

        <AuthMessage message={params.message} type={params.type} />

        <form action={updateRecoveredPasswordAction} className="auth-form">
          <label className="form-field">
            <span>Nueva contraseña</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <small>Mínimo 6 caracteres</small>
          </label>

          <div className="button-row button-row-single">
            <AuthSubmitButton label="Guardar nueva contraseña" pendingLabel="Guardando..." />
          </div>
        </form>
      </section>
    </main>
  );
}
