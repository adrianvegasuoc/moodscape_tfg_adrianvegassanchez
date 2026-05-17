import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase para componentes de servidor, acciones de servidor y rutas de servidor.
 *
 * El cliente se enlaza a las cookies de la petición actual para leer y actualizar
 * la sesión del usuario autenticado. Esto permite que Supabase Auth mantenga la
 * sesión sincronizada entre renderizado servidor, acciones y redirecciones.
 *
 * @module
 */

/**
 * Crea un cliente Supabase de servidor ligado a las cookies de la petición actual.
 *
 * Debe usarse en código de servidor cuando se necesite consultar datos bajo la
 * sesión real del usuario, respetando RLS y las cookies gestionadas por Supabase.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const env = getSupabaseEnv();

  return createServerClient<Database>(
    env.nextPublicSupabaseUrl,
    env.nextPublicSupabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );
}
