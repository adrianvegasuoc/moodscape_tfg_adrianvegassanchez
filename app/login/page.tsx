import { AuthForm } from "@/components/auth-form";
import { AuthMessage } from "@/components/auth-message";
import { redirectIfAuthenticated } from "@/lib/supabase/auth";

import { loginAction } from "@/app/login/actions";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated();

  const params = await searchParams;

  return (
    <AuthForm
      title="Iniciar sesión"
      description="Accede con tu email y contraseña para entrar en Moodscape."
      submitLabel="Iniciar sesión"
      forgotPasswordHref="/recuperar-password"
      alternateText="¿No tienes cuenta?"
      alternateHref="/register"
      alternateLabel="Crear cuenta"
      action={loginAction}
    >
      <AuthMessage message={params.message} type={params.type} />
    </AuthForm>
  );
}
