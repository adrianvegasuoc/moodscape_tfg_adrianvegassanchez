"use client";

import { useFormStatus } from "react-dom";

type GenerateImageSubmitButtonProps = {
  disabled?: boolean;
};

export function GenerateImageSubmitButton({ disabled = false }: GenerateImageSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button creation-submit" disabled={disabled || pending} type="submit">
      {pending ? "Creando..." : "Crear imagen"}
    </button>
  );
}
