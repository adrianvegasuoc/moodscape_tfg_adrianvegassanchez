type AuthFormProps = {
  title: string;
  description: string;
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
          </label>

          <button className="primary-button" type="submit">
            {submitLabel}
          </button>
        </form>
        <p className="helper-text">
          {alternateText} <a href={alternateHref}>{alternateLabel}</a>
        </p>
      </section>
    </main>
  );
}
