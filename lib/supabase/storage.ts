import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

const GENERATED_IMAGES_BUCKET = "generated-images";

type AuthenticatedSupabaseClient = SupabaseClient<Database>;

type UploadGeneratedImageInput = {
  bytes: Buffer;
  contentType: string;
  extension: "png" | "jpeg" | "webp";
  userId: string;
};

export type UploadedGeneratedImage = {
  path: string;
  publicUrl: string;
};

function buildGeneratedImagePath(userId: string, extension: "png" | "jpeg" | "webp") {
  return `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

// Las imagenes generadas se guardan en Storage y solo persistimos la URL final en posts.
export async function uploadGeneratedImage(
  supabase: AuthenticatedSupabaseClient,
  input: UploadGeneratedImageInput
): Promise<UploadedGeneratedImage> {
  const path = buildGeneratedImagePath(input.userId, input.extension);

  const { error } = await supabase.storage
    .from(GENERATED_IMAGES_BUCKET)
    .upload(path, input.bytes, {
      contentType: input.contentType,
      upsert: false
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(GENERATED_IMAGES_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl
  };
}

export async function removeGeneratedImage(
  supabase: AuthenticatedSupabaseClient,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(GENERATED_IMAGES_BUCKET).remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}
