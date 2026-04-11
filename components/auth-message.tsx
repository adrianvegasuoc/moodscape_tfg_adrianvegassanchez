type AuthMessageProps = {
  message?: string;
  type?: string;
};

export function AuthMessage({ message, type }: AuthMessageProps) {
  if (!message) {
    return null;
  }

  const className = type === "success" ? "feedback feedback-success" : "feedback feedback-error";

  return (
    <p className={className} role="status">
      {message}
    </p>
  );
}
