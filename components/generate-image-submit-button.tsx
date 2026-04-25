"use client";

import { useFormStatus } from "react-dom";

export function GenerateImageSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button creation-submit" disabled={pending} type="submit">
      {pending ? "Generando..." : "Enviar"}
    </button>
  );
}
