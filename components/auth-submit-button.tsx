"use client";

import { useFormStatus } from "react-dom";

type AuthSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
};

export function AuthSubmitButton({ label, pendingLabel = "Enviando..." }: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button" disabled={pending} type="submit">
      {pending ? pendingLabel : label}
    </button>
  );
}
