import "server-only";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import { getServiceRoleKey, getSupabaseEnv, hasServiceRoleKey } from "@/lib/env";
import { getUserHandle } from "@/lib/user";
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

// Este helper obtiene el nick de un usuario desde auth.users sin exponer permisos al cliente.
export async function getUserHandleById(userId: string) {
  if (!hasServiceRoleKey()) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    return null;
  }

  const targetUser = data.user as User | null;

  if (!targetUser) {
    return null;
  }

  return getUserHandle(targetUser);
}
