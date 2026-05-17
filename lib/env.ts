function getEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

/** Comprueba si las variables públicas de Supabase están disponibles. */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Devuelve la URL y la anon key necesarias para crear clientes Supabase. */
export function getSupabaseEnv() {
  return {
    nextPublicSupabaseUrl: getEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
    nextPublicSupabaseAnonKey: getEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  };
}

/** Devuelve la service role key para operaciones de servidor con permisos elevados. */
export function getServiceRoleKey() {
  return getEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Permite degradar funcionalidades opcionales cuando no existe service role key. */
export function hasServiceRoleKey() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Devuelve la clave privada utilizada exclusivamente desde servidor para OpenAI. */
export function getOpenAiApiKey() {
  return getEnv("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
}

/** Centraliza el modelo de imagen para poder cambiarlo por variable de entorno. */
export function getOpenAiImageModel() {
  return process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
}

/** Activa la generación mock para desarrollo o pruebas sin consumir la API de OpenAI. */
export function isOpenAiMockMode() {
  return process.env.OPENAI_MOCK_MODE === "true";
}
