import { AuthMessage } from "@/components/auth-message";
import { updateProfileAction } from "@/app/perfil/actions";

type ProfileFormProps = {
  email: string;
  message?: string;
  type?: string;
  username: string;
};

export function ProfileForm({ email, message, type, username }: ProfileFormProps) {
  return (
    <section className="profile-page">
      <div className="profile-card">
        <h1 className="profile-title">Modifica la informacion de tu perfil</h1>

        <form action={updateProfileAction} className="profile-form">
          <label className="profile-field">
            <span>@usuario</span>
            <input defaultValue={username} name="username" placeholder="tu_nick" type="text" />
          </label>

          <label className="profile-field">
            <span>Email</span>
            <input defaultValue={email} disabled type="email" />
          </label>

          <label className="profile-field">
            <span>Contraseña actual</span>
            <input
              autoComplete="current-password"
              name="current_password"
              placeholder="Introduce tu contraseña actual"
              type="password"
            />
          </label>

          <label className="profile-field">
            <span>Nueva contraseña</span>
            <input
              autoComplete="new-password"
              name="new_password"
              placeholder="Deja este campo vacio si no quieres cambiarla"
              type="password"
            />
          </label>

          <p className="profile-help">
            Puedes cambiar tu nick en cualquier momento. Si quieres actualizar la contraseña,
            primero debes confirmar la actual.
          </p>

          <AuthMessage message={message} type={type} />

          <button className="primary-button profile-submit" type="submit">
            Actualizar
          </button>
        </form>
      </div>
    </section>
  );
}
