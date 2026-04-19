import Image from "next/image";

import type { Post } from "@/types/posts";

type GeneratedImageResultProps = {
  post: Post;
};

// Este bloque destaca el resultado mas reciente de generacion para que el usuario vea el flujo completo.
export function GeneratedImageResult({ post }: GeneratedImageResultProps) {
  if (!post.image_url) {
    return null;
  }

  return (
    <section className="panel">
      <h2>Resultado generado</h2>
      <p className="helper-text">La imagen ya fue guardada en Storage y registrada en public.posts.</p>
      <Image
        alt={`Imagen generada para: ${post.prompt}`}
        className="generated-image"
        height={1024}
        src={post.image_url}
        unoptimized
        width={1024}
      />
      <p>{post.prompt}</p>
      <a href={post.image_url} rel="noreferrer" target="_blank">
        Abrir archivo en Storage
      </a>
    </section>
  );
}
