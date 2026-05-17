import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase para código ejecutado en navegador.
 *
 * Este módulo solo debe leer variables públicas `NEXT_PUBLIC_*`. Nunca debe usar
 * claves privadas, especialmente `SUPABASE_SERVICE_ROLE_KEY`, porque cualquier
 * código cliente puede terminar expuesto al usuario.
 *
 * @module
 */

/**
 * Crea un cliente Supabase tipado para componentes y flujos ejecutados en navegador.
 *
 * Usa la URL pública y la anon key del proyecto. Las operaciones siguen sometidas
 * a las políticas de seguridad configuradas en Supabase.
 */
export function createBrowserSupabaseClient() {
  const env = getSupabaseEnv();

  return createBrowserClient<Database>(
    env.nextPublicSupabaseUrl,
    env.nextPublicSupabaseAnonKey
  );
}
