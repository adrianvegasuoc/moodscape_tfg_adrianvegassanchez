import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getServiceRoleKey, getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

// Este cliente queda reservado para operaciones de servidor que requieran permisos elevados.
export function createAdminSupabaseClient() {
  const env = getSupabaseEnv();

  return createClient<Database>(
    env.nextPublicSupabaseUrl,
    getServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
