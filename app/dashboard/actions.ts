"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { createUserPost } from "@/lib/supabase/posts";
import { removeGeneratedImage, uploadGeneratedImage } from "@/lib/supabase/storage";
import { generateMoodscapeImage } from "@/services/openai/image-generation";

// Utilidad basica para leer valores de formularios HTML sin repetir comprobaciones.
function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

// Los mensajes del dashboard viajan por query params para mantener la pagina simple.
function buildDashboardRedirect(
  message: string,
  type: "success" | "error",
  generatedPostId?: string
) {
  const params = new URLSearchParams({
    message,
    type
  });

  if (generatedPostId) {
    params.set("generated_post_id", generatedPostId);
  }

  return `/dashboard?${params.toString()}` as Route;
}

// Esta accion coordina la generacion con OpenAI, la subida a Storage y la insercion en posts.
export async function generateImageAction(formData: FormData) {
  // El guard devuelve tanto el usuario como el cliente autenticado listo para consultar RLS.
  const { supabase, user } = await requireAuthenticatedUser();

  // Extraemos y normalizamos los campos del formulario enviado desde dashboard.
  const prompt = getStringValue(formData.get("prompt"));
  const isPublic = formData.get("is_public") === "on";

  if (!prompt) {
    redirect(buildDashboardRedirect("El prompt es obligatorio.", "error"));
  }

  let uploadedImagePath: string | undefined;
  let createdPostId: string | undefined;

  try {
    const generatedImage = await generateMoodscapeImage({
      prompt
    });

    const uploadedImage = await uploadGeneratedImage(supabase, {
      bytes: generatedImage.bytes,
      contentType: generatedImage.mimeType,
      extension: generatedImage.outputFormat,
      userId: user.id
    });

    uploadedImagePath = uploadedImage.path;

    const post = await createUserPost(supabase, user, {
      prompt,
      imageUrl: uploadedImage.publicUrl,
      isPublic
    });

    createdPostId = post.id;
  } catch (error) {
    if (uploadedImagePath) {
      try {
        await removeGeneratedImage(supabase, uploadedImagePath);
      } catch {
        // Si falla la limpieza, priorizamos mostrar el error principal al usuario.
      }
    }

    const message =
      error instanceof Error ? error.message : "No se pudo generar y guardar la imagen.";
    redirect(buildDashboardRedirect(message, "error"));
  }

  revalidatePath("/dashboard");
  redirect(
    buildDashboardRedirect("Imagen generada y guardada correctamente.", "success", createdPostId)
  );
}
