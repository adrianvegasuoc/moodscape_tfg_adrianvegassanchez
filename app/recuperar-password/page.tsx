import Link from "next/link";

import { recoverPasswordAction } from "@/app/login/actions";
import { AuthMessage } from "@/components/auth-message";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { redirectIfAuthenticated } from "@/lib/supabase/auth";

type RecoverPasswordPageProps = {
  searchParams: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function RecoverPasswordPage({ searchParams }: RecoverPasswordPageProps) {
  await redirectIfAuthenticated();

  const params = await searchParams;

  return (
    <main className="page-shell auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Moodscape</p>
        <h1>Recuperar contraseña</h1>
        <p>Introduce tu email y te enviaremos instrucciones para restablecer tu contraseña.</p>

        <AuthMessage message={params.message} type={params.type} />

        <form action={recoverPasswordAction} className="auth-form">
          <label className="form-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <div className="button-row button-row-single">
            <AuthSubmitButton label="Enviar instrucciones" pendingLabel="Enviando..." />
          </div>
        </form>

        <p className="helper-text auth-footer">
          <Link href="/login">Volver a iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}
