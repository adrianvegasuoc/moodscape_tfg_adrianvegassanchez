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

// Filtra conectores y términos demasiado genéricos para que Explorar muestre hashtags útiles.
const STOP_WORDS = new Set([
  "ante",
  "aquel",
  "aquella",
  "aquellas",
  "aquello",
  "aquellos",
  "bajo",
  "cabe",
  "como",
  "con",
  "contra",
  "cuando",
  "desde",
  "donde",
  "entre",
  "eres",
  "esta",
  "estaba",
  "estaban",
  "estado",
  "estamos",
  "estar",
  "estas",
  "este",
  "esto",
  "estoy",
  "feliz",
  "hacer",
  "hacia",
  "hasta",
  "mientras",
  "para",
  "pero",
  "porque",
  "pueblo",
  "quiero",
  "segun",
  "siento",
  "sentir",
  "sobre",
  "tengo",
  "tiene",
  "tienen",
  "tras",
  "unas",
  "unos",
  "viaje"
]);

/** Devuelve las creaciones del usuario actual ordenadas de más recientes a más antiguas. */
export async function getUserPosts(
  supabase: AuthenticatedSupabaseClient,
  userId: string
): Promise<Post[]> {
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

/** Devuelve creaciones públicas con imagen para alimentar la vista Explorar. */
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

/** Recupera un post visible por id para mostrar el resultado recién generado o compartido. */
export async function getVisiblePostById(
  supabase: AuthenticatedSupabaseClient,
  postId: string
): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .not("image_url", "is", null)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
}

/** Inserta una creación usando el cliente autenticado para mantener las políticas RLS activas. */
export async function createUserPost(
  supabase: AuthenticatedSupabaseClient,
  user: User,
  input: CreatePostInput
): Promise<Post> {
  const payload: InsertPost = {
    id: crypto.randomUUID(),
    user_id: user.id,
    prompt: input.prompt,
    image_url: input.imageUrl,
    created_at: new Date().toISOString(),
    is_public: input.isPublic
  };

  const { data, error } = await supabase.from("posts").insert(payload).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/** Cuenta creaciones ya guardadas desde una fecha para aplicar límites de uso diarios. */
export async function getUserCreationCountSince(
  supabase: AuthenticatedSupabaseClient,
  userId: string,
  since: string
): Promise<number> {
  const { count, error } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("image_url", "is", null)
    .gte("created_at", since);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

function normalizePromptWord(word: string) {
  return word
    .toLocaleLowerCase("es-ES")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();
}

/** Extrae términos significativos del prompt y descarta palabras poco útiles para hashtags. */
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

/** Calcula hashtags de tendencia a partir de la frecuencia de términos en posts públicos. */
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

/** Busca posts relacionados mediante coincidencia textual simple sobre el prompt. */
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

/** Devuelve recomendaciones recientes cuando no hay suficientes coincidencias por término. */
export async function getFallbackRecommendedPosts(
  supabase: AuthenticatedSupabaseClient,
  excludePostId?: string,
  limit = 3
): Promise<Post[]> {
  let query = supabase
    .from("posts")
    .select("*")
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
