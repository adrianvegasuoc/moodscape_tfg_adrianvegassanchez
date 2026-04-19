import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { InsertPost, Post } from "@/types/posts";

type AuthenticatedSupabaseClient = SupabaseClient<Database>;

type CreatePostInput = {
  prompt: string;
  imageUrl: string | null;
  isPublic: boolean;
};

// Estas utilidades encapsulan el acceso a public.posts usando el usuario autenticado real.
export async function getUserPosts(
  supabase: AuthenticatedSupabaseClient,
  userId: string
): Promise<Post[]> {
  // Filtramos por user_id para respetar el alcance del usuario actual tambien a nivel de consulta.
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createUserPost(
  supabase: AuthenticatedSupabaseClient,
  user: User,
  input: CreatePostInput
): Promise<Post> {
  // Construimos la fila completa en servidor para no depender de campos ocultos en cliente.
  const payload: InsertPost = {
    id: crypto.randomUUID(),
    user_id: user.id,
    prompt: input.prompt,
    image_url: input.imageUrl,
    created_at: new Date().toISOString(),
    is_public: input.isPublic
  };

  // La insercion usa el cliente autenticado del usuario, por lo que sigue sometida a RLS.
  const { data, error } = await supabase.from("posts").insert(payload).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
