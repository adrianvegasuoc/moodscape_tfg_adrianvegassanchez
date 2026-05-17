import { AuthForm } from "@/components/auth-form";
import { AuthMessage } from "@/components/auth-message";
import { redirectIfAuthenticated } from "@/lib/supabase/auth";

import { registerAction } from "@/app/login/actions";

type RegisterPageProps = {
  searchParams: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  await redirectIfAuthenticated();

  const params = await searchParams;

  return (
    <AuthForm
      title="Crear cuenta"
      description="Registra un usuario con email y contraseña para acceder"
      submitLabel="Registrarse"
      passwordAutoComplete="new-password"
      passwordHint="Mínimo 6 caracteres"
      alternateText="¿Ya tienes cuenta?"
      alternateHref="/login"
      alternateLabel="Iniciar sesión"
      action={registerAction}
    >
      <AuthMessage message={params.message} type={params.type} />
    </AuthForm>
  );
}
