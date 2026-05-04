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

// Esta pagina renderiza el formulario de acceso y delega la autenticacion en una Server Action.
export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Evita mostrar esta pagina si el usuario ya dispone de una sesion valida.
  await redirectIfAuthenticated();

  // Leemos el mensaje desde la URL para mostrar errores o confirmaciones del flujo.
  const params = await searchParams;

  return (
    <AuthForm
      // El componente AuthForm encapsula la estructura visual comun de login y registro.
      title="Iniciar sesión"
      description="Accede con tu email y contraseña para entrar en Moodscape."
      submitLabel="Iniciar sesión"
      forgotPasswordHref="/recuperar-password"
      alternateText="¿No tienes cuenta?"
      alternateHref="/register"
      alternateLabel="Crear cuenta"
      action={loginAction}
    >
      {/* Este bloque muestra errores de validacion o mensajes de exito enviados por redirect. */}
      <AuthMessage message={params.message} type={params.type} />
    </AuthForm>
  );
}
