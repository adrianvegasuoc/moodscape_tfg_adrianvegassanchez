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

const STOP_WORDS = new Set([
  "ante",
  "bajo",
  "cabe",
  "como",
  "con",
  "contra",
  "desde",
  "donde",
  "entre",
  "feliz",
  "hacia",
  "hasta",
  "para",
  "pero",
  "pueblo",
  "segun",
  "sobre",
  "tras",
  "unas",
  "unos",
  "viaje"
]);

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

export async function getPublicPosts(
  supabase: AuthenticatedSupabaseClient,
  limit = 60
): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_public", true)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

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

function normalizePromptWord(word: string) {
  return word
    .toLocaleLowerCase("es-ES")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();
}

export function extractPromptTerms(prompt: string, limit = 3) {
  const uniqueTerms = new Set<string>();

  for (const word of prompt.split(/[\s,.;:!?]+/)) {
    const normalizedWord = normalizePromptWord(word);

    if (normalizedWord.length < 4 || STOP_WORDS.has(normalizedWord)) {
      continue;
    }

    uniqueTerms.add(normalizedWord);

    if (uniqueTerms.size >= limit) {
      break;
    }
  }

  return Array.from(uniqueTerms);
}

export function buildTrendingTerms(posts: Post[], limit = 6) {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    extractPromptTerms(post.prompt, 4).forEach((term) => {
      counts.set(term, (counts.get(term) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([term]) => term);
}

export async function getPostsByPromptTerm(
  supabase: AuthenticatedSupabaseClient,
  term: string,
  excludePostId?: string,
  limit = 6
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*")
    .ilike("prompt", `%${term}%`)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (excludePostId) {
    query = query.neq("id", excludePostId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
