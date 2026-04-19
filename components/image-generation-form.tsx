import { generateImageAction } from "@/app/dashboard/actions";
import { GenerateImageSubmitButton } from "@/components/generate-image-submit-button";

type ImageGenerationFormProps = {
  message?: string;
  type?: string;
};

// Formulario minimo para generar una imagen y guardarla automaticamente en Storage y posts.
export function ImageGenerationForm({ message, type }: ImageGenerationFormProps) {
  return (
    <section className="panel">
      <h2>Generar imagen emocional</h2>
      <p className="helper-text">
        El prompt se envia al servidor, la imagen se genera con OpenAI y se guarda en
        <code> generated-images </code> antes de persistir la fila en <code>public.posts</code>.
      </p>

      {message ? (
        <p className={type === "success" ? "feedback feedback-success" : "feedback feedback-error"}>
          {message}
        </p>
      ) : null}

      {/* La generacion se ejecuta en servidor para proteger las claves y la integracion con Storage. */}
      <form action={generateImageAction} className="auth-form">
        <label className="form-field">
          <span>Prompt emocional</span>
          <textarea
            name="prompt"
            placeholder="Describe una emocion, atmosfera o escena que quieras transformar en imagen."
            rows={6}
            required
          />
        </label>

        <label className="checkbox-field">
          {/* Si el checkbox no se envia, en servidor lo interpretamos como false. */}
          <input defaultChecked name="is_public" type="checkbox" />
          <span>Guardar como publicacion visible</span>
        </label>

        <GenerateImageSubmitButton />
      </form>
    </section>
  );
}
