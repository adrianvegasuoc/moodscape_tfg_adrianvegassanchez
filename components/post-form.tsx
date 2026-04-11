import { createPostAction } from "@/app/dashboard/actions";

type PostFormProps = {
  message?: string;
  type?: string;
};

// Formulario minimo para crear una fila de prueba en public.posts.
export function PostForm({ message, type }: PostFormProps) {
  return (
    <section className="panel">
      <h2>Nueva publicacion de prueba</h2>
      <p className="helper-text">
        Este formulario inserta filas reales en <code>public.posts</code> con el usuario autenticado.
      </p>

      {message ? (
        <p className={type === "success" ? "feedback feedback-success" : "feedback feedback-error"}>
          {message}
        </p>
      ) : null}

      {/* La insercion se ejecuta en servidor mediante la Server Action createPostAction. */}
      <form action={createPostAction} className="auth-form">
        <label className="form-field">
          <span>Prompt</span>
          <textarea name="prompt" rows={5} required />
        </label>

        <label className="form-field">
          <span>Image URL</span>
          <input name="image_url" type="url" placeholder="https://..." />
        </label>

        <label className="checkbox-field">
          {/* Si el checkbox no se envia, en servidor lo interpretamos como false. */}
          <input defaultChecked name="is_public" type="checkbox" />
          <span>Publicar como visible</span>
        </label>

        <button className="primary-button" type="submit">
          Crear publicacion
        </button>
      </form>
    </section>
  );
}
