"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { generateImageAction } from "@/app/dashboard/actions";
import { GenerateImageSubmitButton } from "@/components/generate-image-submit-button";
import { MAX_PROMPT_LENGTH, validatePrompt } from "@/lib/validation/prompt-validation";

type ImageGenerationFormProps = {
  message?: string;
  type?: string;
};

const suggestionChips = [
  "Feliz",
  "Viaje",
  "Paseo",
  "Amanecer",
  "Amigos",
  "Pueblo",
  "Deporte",
  "Naturaleza",
  "Enfermo",
  "Motivado",
  "Tren",
  "Playa",
  "Estrés",
  "Café",
  "Fiesta"
];

const INITIAL_VISIBLE_CHIPS = 5;

function appendChipToPrompt(currentPrompt: string, chip: string) {
  const normalizedChip = chip.toLocaleLowerCase("es-ES");

  if (!currentPrompt.trim()) {
    return normalizedChip;
  }

  const trimmedPrompt = currentPrompt.trimEnd();
  const separator = trimmedPrompt.endsWith(",") ? " " : ", ";

  return `${trimmedPrompt}${separator}${normalizedChip}`;
}

// Formulario minimo para generar una imagen y guardarla automaticamente en Storage y posts.
export function ImageGenerationForm({ message, type }: ImageGenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [clientError, setClientError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleChips = isExpanded ? suggestionChips : suggestionChips.slice(0, INITIAL_VISIBLE_CHIPS);
  const feedbackMessage = clientError || message;
  const feedbackType = clientError ? "error" : type;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const promptValidation = validatePrompt(prompt);

    if (!promptValidation.valid || !promptValidation.sanitizedPrompt) {
      event.preventDefault();
      setClientError(
        promptValidation.reason || "El texto contiene caracteres o patrones no permitidos."
      );
      return;
    }

    setClientError("");
    setPrompt(promptValidation.sanitizedPrompt);
    const promptField = event.currentTarget.elements.namedItem("prompt");

    if (promptField instanceof HTMLTextAreaElement) {
      promptField.value = promptValidation.sanitizedPrompt;
    }
  }

  return (
    <section className="creation-screen">
      <h1 className="creation-title">¿Qué vas a crear hoy?</h1>

      <div className="chip-group" aria-label="Sugerencias de inspiracion">
        {visibleChips.map((chip) => (
          <button
            className="suggestion-chip"
            key={chip}
            onClick={() => {
              setPrompt((currentPrompt) => appendChipToPrompt(currentPrompt, chip));
              setClientError("");
            }}
            type="button"
          >
            <span aria-hidden="true">+</span>
            {chip}
          </button>
        ))}
      </div>

      {suggestionChips.length > INITIAL_VISIBLE_CHIPS ? (
        <button
          className="more-chip-button"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
          type="button"
        >
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      ) : null}

      {feedbackMessage ? (
        <p
          className={
            feedbackType === "success"
              ? "feedback feedback-success creation-feedback"
              : "feedback feedback-error creation-feedback"
          }
        >
          {feedbackMessage}
        </p>
      ) : null}

      {/* La generacion se ejecuta en servidor para proteger las claves y la integracion con Storage. */}
      <form action={generateImageAction} className="creation-form" onSubmit={handleSubmit}>
        <input name="is_public" type="hidden" value="on" />
        <textarea
          className="creation-textarea"
          maxLength={MAX_PROMPT_LENGTH + 1}
          name="prompt"
          onChange={(event) => {
            setPrompt(event.target.value);
            setClientError("");
          }}
          placeholder={
            "Describe un momento, una sensacion o un recuerdo...\n“Día inolvidable en mi pueblo con mi familia rodeados de naturaleza”\n“Viaje, amigos, México, jacarandas”"
          }
          rows={5}
          required
          value={prompt}
        />
        <GenerateImageSubmitButton />
      </form>
    </section>
  );
}
