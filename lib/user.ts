import type { User } from "@supabase/supabase-js";

type UserMetadata = Record<string, unknown>;

function getUserMetadata(user: User): UserMetadata {
  return user.user_metadata && typeof user.user_metadata === "object"
    ? (user.user_metadata as UserMetadata)
    : {};
}

function getEmailPrefix(email: string | undefined) {
  return email ? email.split("@")[0] : "moodscape";
}

/** Devuelve el identificador visible del usuario priorizando `user_metadata.username`. */
export function getUserHandle(user: User) {
  const metadata = getUserMetadata(user);
  const username = metadata.username;

  if (typeof username === "string" && username.trim()) {
    return username.trim().replace(/^@+/, "");
  }

  return getEmailPrefix(user.email);
}

/** Calcula la inicial usada en el avatar del menú de usuario. */
export function getUserInitial(user: User) {
  return getUserHandle(user).slice(0, 1).toUpperCase();
}

/** Fusiona metadata existente con el nuevo nick sin borrar otros campos de Supabase Auth. */
export function getUpdatedUserMetadata(user: User, username: string) {
  return {
    ...getUserMetadata(user),
    username
  };
}
