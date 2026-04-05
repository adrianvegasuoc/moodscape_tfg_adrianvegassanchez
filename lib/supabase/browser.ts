import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createBrowserSupabaseClient() {
  const env = getSupabaseEnv();

  return createBrowserClient<Database>(
    env.nextPublicSupabaseUrl,
    env.nextPublicSupabaseAnonKey
  );
}
