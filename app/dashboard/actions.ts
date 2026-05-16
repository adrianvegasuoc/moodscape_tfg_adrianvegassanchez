"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { createUserPost } from "@/lib/supabase/posts";
import { removeGeneratedImage, uploadGeneratedImage } from "@/lib/supabase/storage";
import { validatePrompt } from "@/lib/validation/prompt-validation";
import { generateMoodscapeImage } from "@/services/openai/image-generation";

// Utilidad basica para leer valores de formularios HTML sin repetir comprobaciones.
function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

// Los mensajes de la Home privada viajan por query params para mantener la pagina simple.
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
    params.set("post_id", generatedPostId);
  }

  return `/?${params.toString()}` as Route;
}

// Esta accion coordina la generacion con OpenAI, la subida a Storage y la insercion en posts.
export async function generateImageAction(formData: FormData) {
  // El guard devuelve tanto el usuario como el cliente autenticado listo para consultar RLS.
  const { supabase, user } = await requireAuthenticatedUser();

  // Extraemos y normalizamos los campos del formulario enviado desde la Home privada.
  const prompt = getStringValue(formData.get("prompt"));
  const isPublic = formData.get("is_public") === "on";
  const promptValidation = validatePrompt(prompt);

  if (!promptValidation.valid || !promptValidation.sanitizedPrompt) {
    redirect(
      buildDashboardRedirect(
        promptValidation.reason || "El texto contiene caracteres o patrones no permitidos.",
        "error"
      )
    );
  }

  const sanitizedPrompt = promptValidation.sanitizedPrompt;

  let uploadedImagePath: string | undefined;
  let createdPostId: string | undefined;

  try {
    const generatedImage = await generateMoodscapeImage({
      prompt: sanitizedPrompt
    });

    const uploadedImage = await uploadGeneratedImage(supabase, {
      bytes: generatedImage.bytes,
      contentType: generatedImage.mimeType,
      extension: generatedImage.outputFormat,
      userId: user.id
    });

    uploadedImagePath = uploadedImage.path;

    const post = await createUserPost(supabase, user, {
      prompt: sanitizedPrompt,
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

    console.error("Image generation failed", error);
    redirect(
      buildDashboardRedirect(
        "No se pudo generar la imagen en este momento. Inténtalo de nuevo más tarde.",
        "error"
      )
    );
  }

  revalidatePath("/");
  revalidatePath("/mi-mapa-emocional");
  redirect(
    buildDashboardRedirect("Imagen generada y guardada correctamente.", "success", createdPostId)
  );
}
