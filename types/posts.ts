import type { Database } from "@/types/database";

/** Fila de la tabla `posts` generada desde los tipos de Supabase. */
export type Post = Database["public"]["Tables"]["posts"]["Row"];

/** Payload permitido para insertar nuevas creaciones en `posts`. */
export type InsertPost = Database["public"]["Tables"]["posts"]["Insert"];
