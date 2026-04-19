import "server-only";

import { getOpenAiApiKey, getOpenAiImageModel, isOpenAiMockMode } from "@/lib/env";

export type GenerateMoodscapeImageInput = {
  prompt: string;
  mood?: string;
};

export type GenerateMoodscapeImageResult = {
  bytes: Buffer;
  mimeType: string;
  outputFormat: "png" | "jpeg" | "webp";
  revisedPrompt: string;
};

function buildImagePrompt(input: GenerateMoodscapeImageInput) {
  const basePrompt =
    "Genera una imagen artistica y evocadora basada en esta emocion o descripcion emocional.";

  if (!input.mood) {
    return `${basePrompt} Prompt del usuario: ${input.prompt}`;
  }

  return `${basePrompt} Emocion principal: ${input.mood}. Prompt del usuario: ${input.prompt}`;
}

function getMockImageBuffer() {
  const mockBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9oN8W1QAAAAASUVORK5CYII=";

  return Buffer.from(mockBase64, "base64");
}

// Esta capa encapsula la llamada a OpenAI y devuelve los bytes listos para subir a Storage.
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
