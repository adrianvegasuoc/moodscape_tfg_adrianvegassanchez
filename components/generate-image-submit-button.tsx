"use client";

import { useFormStatus } from "react-dom";

export function GenerateImageSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button" disabled={pending} type="submit">
      {pending ? "Generando imagen..." : "Generar imagen"}
    </button>
  );
}
