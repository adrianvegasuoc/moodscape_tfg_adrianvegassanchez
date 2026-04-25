import Image from "next/image";

import type { Post } from "@/types/posts";

type GeneratedImageResultProps = {
  authorLabel: string;
  post: Post;
  relatedPosts: Post[];
};

function buildTags(prompt: string) {
  const words = prompt
    .split(/[\s,.;:!?]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3)
    .slice(0, 4);

  return words.map((word) => `#${word.replace(/[^\p{L}\p{N}]/gu, "")}`).filter(Boolean);
}

// Este bloque destaca el resultado mas reciente de generacion para que el usuario vea el flujo completo.
export function GeneratedImageResult({ post, relatedPosts, authorLabel }: GeneratedImageResultProps) {
  if (!post.image_url) {
    return null;
  }

  const tags = buildTags(post.prompt);

  return (
    <section className="result-screen">
      <article className="result-card">
        <p className="result-title">{post.prompt}</p>
        <Image
          alt={`Imagen generada para: ${post.prompt}`}
          className="generated-image"
          height={1024}
          src={post.image_url}
          unoptimized
          width={1024}
        />
        <div className="result-meta">
          <div className="result-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className="result-author">@{authorLabel}</span>
        </div>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="related-gallery">
          <div className="related-header">
            <strong>Explora imágenes relacionadas con tu creación</strong>
            <span aria-hidden="true">▾</span>
          </div>

          <div className="related-section">
            <p>Más sobre esta atmósfera</p>
            <div className="related-grid">
              {relatedPosts.map((item) =>
                item.image_url ? (
                  <Image
                    alt={`Referencia visual para: ${item.prompt}`}
                    className="related-image"
                    height={320}
                    key={item.id}
                    src={item.image_url}
                    unoptimized
                    width={320}
                  />
                ) : null
              )}
            </div>
          </div>

          <button className="more-chip-button" type="button">
            Ver más
          </button>
        </section>
      ) : null}
    </section>
  );
}
