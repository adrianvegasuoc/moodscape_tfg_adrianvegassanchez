import { AuthSubmitButton } from "@/components/auth-submit-button";

type AuthFormProps = {
  title: string;
  description: string;
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
  passwordHint?: string;
  submitLabel: string;
  passwordAutoComplete?: "current-password" | "new-password";
  alternateText: string;
  alternateHref: string;
  alternateLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  children?: React.ReactNode;
};

export function AuthForm({
  title,
  description,
  forgotPasswordHref,
  forgotPasswordLabel = "¿Olvidaste tu contraseña?",
  passwordHint,
  submitLabel,
  passwordAutoComplete = "current-password",
  alternateText,
  alternateHref,
  alternateLabel,
  action,
  children
}: AuthFormProps) {
  return (
    <main className="page-shell auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">Moodscape</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
        <form action={action} className="auth-form">
          <label className="form-field">
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete={passwordAutoComplete}
              minLength={6}
              required
            />
            {passwordHint ? <small>{passwordHint}</small> : null}
          </label>

          {forgotPasswordHref ? (
            <a className="auth-secondary-link" href={forgotPasswordHref}>
              {forgotPasswordLabel}
            </a>
          ) : null}

          <div className="button-row">
            <AuthSubmitButton label={submitLabel} />
            <a className="secondary-button" href={alternateHref}>
              {alternateLabel}
            </a>
          </div>
        </form>
        <p className="helper-text auth-footer">
          {alternateText} <a href={alternateHref}>{alternateLabel}</a>
        </p>
      </section>
    </main>
  );
}
