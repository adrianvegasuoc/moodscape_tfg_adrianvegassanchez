import type { Database } from "@/types/database";

// Alias locales para no repetir rutas largas del tipo generado de Supabase.
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type InsertPost = Database["public"]["Tables"]["posts"]["Insert"];
