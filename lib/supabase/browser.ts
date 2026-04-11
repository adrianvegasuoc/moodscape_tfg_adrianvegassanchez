import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

// Cliente para componentes cliente y acciones ejecutadas en el navegador.
export function createBrowserSupabaseClient() {
  const env = getSupabaseEnv();

  return createBrowserClient<Database>(
    env.nextPublicSupabaseUrl,
    env.nextPublicSupabaseAnonKey
  );
}
