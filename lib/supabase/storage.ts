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

/** Referencias necesarias para persistir una imagen generada o limpiarla si falla el flujo. */
export type UploadedGeneratedImage = {
  path: string;
  publicUrl: string;
};

function buildGeneratedImagePath(userId: string, extension: "png" | "jpeg" | "webp") {
  return `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

/** Sube una imagen generada al bucket público y devuelve su ruta interna y URL pública. */
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

/** Elimina una imagen generada cuando se necesita revertir una creación incompleta. */
export async function removeGeneratedImage(
  supabase: AuthenticatedSupabaseClient,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(GENERATED_IMAGES_BUCKET).remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}
