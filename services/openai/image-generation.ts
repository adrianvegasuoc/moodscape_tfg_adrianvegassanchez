import "server-only";

import { getOpenAiApiKey, getOpenAiImageModel, isOpenAiMockMode } from "@/lib/env";

/**
 * Integración de servidor con la generación de imágenes de Moodscape.
 *
 * Este módulo encapsula la llamada al proveedor de imágenes y devuelve bytes
 * listos para subir a Supabase Storage. También soporta modo mock para desarrollo
 * y pruebas locales sin consumir la API.
 *
 * Variables de entorno usadas:
 * - `OPENAI_API_KEY`: clave privada del proveedor. Solo debe existir y usarse en servidor.
 * - `OPENAI_IMAGE_MODEL`: modelo de imagen configurable; usa `gpt-image-1` como fallback.
 * - `OPENAI_MOCK_MODE`: si vale `"true"`, evita la llamada externa y devuelve una imagen mínima.
 *
 * @module
 */

/** Entrada normalizada que recibe el servicio de generación de imágenes de Moodscape. */
export type GenerateMoodscapeImageInput = {
  /** Prompt validado y saneado que describe la escena emocional a generar. */
  prompt: string;
  /** Emoción principal opcional para reforzar el prompt de estilo. */
  mood?: string;
};

/** Imagen generada en bytes junto a los metadatos necesarios para guardarla en Storage. */
export type GenerateMoodscapeImageResult = {
  /** Contenido binario de la imagen generada. */
  bytes: Buffer;
  /** Tipo MIME que debe usarse al subir la imagen a Storage. */
  mimeType: string;
  /** Formato de salida solicitado al proveedor y usado como extensión de archivo. */
  outputFormat: "png" | "jpeg" | "webp";
  /** Prompt revisado devuelto por el proveedor o prompt original en modo mock. */
  revisedPrompt: string;
};

const MOODSCAPE_STYLE_PREFIX = [
  "Genera una imagen original de alta calidad.",
  "Directrices visuales obligatorias: expresionismo, sentimientos intensos y composicion abstracta.",
  "La imagen debe priorizar la atmosfera emocional, la fuerza cromatica, el gesto pictorico y una interpretacion artistica evocadora.",
  "Usa la descripcion del usuario como base tematica o narrativa, pero manteniendo siempre ese lenguaje visual."
].join(" ");

function buildImagePrompt(input: GenerateMoodscapeImageInput) {
  if (!input.mood) {
    return `${MOODSCAPE_STYLE_PREFIX} Descripcion del usuario: ${input.prompt}`;
  }

  return `${MOODSCAPE_STYLE_PREFIX} Emocion principal: ${input.mood}. Descripcion del usuario: ${input.prompt}`;
}

function getMockImageBuffer() {
  const mockBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9oN8W1QAAAAASUVORK5CYII=";

  return Buffer.from(mockBase64, "base64");
}

/**
 * Genera una imagen real o mock y devuelve bytes listos para subir a Supabase Storage.
 *
 * En modo real requiere `OPENAI_API_KEY`; si falta, el helper de entorno lanza un
 * error explícito. También lanza error si el proveedor responde con fallo o si la
 * respuesta no contiene datos de imagen en base64.
 */
export async function generateMoodscapeImage(
  input: GenerateMoodscapeImageInput
): Promise<GenerateMoodscapeImageResult> {
  if (isOpenAiMockMode()) {
    return {
      bytes: getMockImageBuffer(),
      mimeType: "image/png",
      outputFormat: "png",
      revisedPrompt: input.prompt
    };
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAiApiKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: getOpenAiImageModel(),
      prompt: buildImagePrompt(input),
      size: "1024x1024",
      quality: "medium",
      output_format: "png"
    })
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;

    throw new Error(errorPayload?.error?.message || "OpenAI no pudo generar la imagen.");
  }

  const payload = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
      revised_prompt?: string;
    }>;
  };

  const imageBase64 = payload.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error("OpenAI no devolvio datos de imagen.");
  }

  return {
    bytes: Buffer.from(imageBase64, "base64"),
    mimeType: "image/png",
    outputFormat: "png",
    revisedPrompt: payload.data?.[0]?.revised_prompt || input.prompt
  };
}
