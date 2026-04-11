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

// Esta pagina renderiza el formulario de alta y reutiliza la misma base visual que login.
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  // Un usuario autenticado no necesita volver a la pantalla de registro.
  await redirectIfAuthenticated();

  // Los mensajes del flujo de alta se renderizan desde query params.
  const params = await searchParams;

  return (
    <AuthForm
      // En registro cambiamos solo los textos y el autocomplete del password.
      title="Crear cuenta"
      description="Registra un usuario con email y password para acceder al panel."
      submitLabel="Registrarse"
      passwordAutoComplete="new-password"
      alternateText="¿Ya tienes cuenta?"
      alternateHref="/login"
      alternateLabel="Inicia sesion"
      action={registerAction}
    >
      {/* Mostramos aqui errores de alta o mensajes posteriores al registro. */}
      <AuthMessage message={params.message} type={params.type} />
    </AuthForm>
  );
}
