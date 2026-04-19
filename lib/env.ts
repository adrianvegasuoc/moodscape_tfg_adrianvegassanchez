function getEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

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

export function getServiceRoleKey() {
  return getEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getOpenAiApiKey() {
  return getEnv("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
}

export function getOpenAiImageModel() {
  return process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
}

export function isOpenAiMockMode() {
  return process.env.OPENAI_MOCK_MODE === "true";
}
