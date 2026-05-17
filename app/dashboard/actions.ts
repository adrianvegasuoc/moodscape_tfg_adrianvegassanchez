"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { createUserPost, getUserCreationCountSince } from "@/lib/supabase/posts";
import { removeGeneratedImage, uploadGeneratedImage } from "@/lib/supabase/storage";
import { validatePrompt } from "@/lib/validation/prompt-validation";
import { generateMoodscapeImage } from "@/services/openai/image-generation";

const DAILY_CREATION_LIMIT = 3;

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getServerDayStartIso() {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  return dayStart.toISOString();
}

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

/** Coordina validación, límite diario, OpenAI, Storage y persistencia del post generado. */
export async function generateImageAction(formData: FormData) {
  const { supabase, user } = await requireAuthenticatedUser();

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
  const todayCreationCount = await getUserCreationCountSince(
    supabase,
    user.id,
    getServerDayStartIso()
  );

  if (todayCreationCount >= DAILY_CREATION_LIMIT) {
    redirect(
      buildDashboardRedirect(
        "Has alcanzado el límite diario de creaciones. Vuelve mañana.",
        "error"
      )
    );
  }

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
        // El error principal de generación es más útil para el usuario que un fallo de limpieza.
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
