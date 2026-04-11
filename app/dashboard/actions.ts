"use server";

import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/supabase/auth";
import { createUserPost } from "@/lib/supabase/posts";

// Utilidad basica para leer valores de formularios HTML sin repetir comprobaciones.
function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

// Los mensajes del dashboard viajan por query params para mantener la pagina simple.
function buildDashboardRedirect(message: string, type: "success" | "error") {
  const params = new URLSearchParams({
    message,
    type
  });

  return `/dashboard?${params.toString()}` as Route;
}

// Validacion minima para evitar guardar cadenas que no sean URLs reales.
function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Esta accion crea una fila de prueba en public.posts usando la sesion real del usuario.
export async function createPostAction(formData: FormData) {
  // El guard devuelve tanto el usuario como el cliente autenticado listo para consultar RLS.
  const { supabase, user } = await requireAuthenticatedUser();

  // Extraemos y normalizamos los campos del formulario enviado desde dashboard.
  const prompt = getStringValue(formData.get("prompt"));
  const imageUrlValue = getStringValue(formData.get("image_url"));
  const isPublic = formData.get("is_public") === "on";

  if (!prompt) {
    redirect(buildDashboardRedirect("El prompt es obligatorio.", "error"));
  }

  if (imageUrlValue && !isValidUrl(imageUrlValue)) {
    redirect(buildDashboardRedirect("Image URL debe ser una URL valida.", "error"));
  }

  try {
    // La creacion real se delega a la capa lib/supabase para separar UI y acceso a datos.
    await createUserPost(supabase, user, {
      prompt,
      imageUrl: imageUrlValue || null,
      isPublic
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear la publicacion.";
    redirect(buildDashboardRedirect(message, "error"));
  }

  // Revalidamos dashboard para que el listado refleje inmediatamente la nueva fila insertada.
  revalidatePath("/dashboard");
  redirect(buildDashboardRedirect("Publicacion creada correctamente.", "success"));
}
