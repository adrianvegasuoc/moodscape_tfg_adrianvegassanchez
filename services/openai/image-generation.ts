export type GenerateMoodscapeImageInput = {
  prompt: string;
  mood?: string;
};

export async function generateMoodscapeImage(_input: GenerateMoodscapeImageInput) {
  throw new Error(
    "OpenAI integration is not implemented yet. This file is the prepared entry point for image generation."
  );
}
