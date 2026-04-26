import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import type { Post } from "@/types/posts";

type RelatedRow = {
  posts: Post[];
  title: string;
};

type GeneratedImageResultProps = {
  authorLabel?: string;
  post: Post;
  relatedRows: RelatedRow[];
};

function buildResultHref(postId: string) {
  return `/?post_id=${encodeURIComponent(postId)}` as Route;
}

function buildTags(prompt: string) {
  const words = prompt
    .split(/[\s,.;:!?]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3)
    .slice(0, 8);

  return words.map((word) => `#${word.replace(/[^\p{L}\p{N}]/gu, "")}`).filter(Boolean);
}

// Este bloque destaca el resultado mas reciente de generacion para que el usuario vea el flujo completo.
export function GeneratedImageResult({ post, relatedRows, authorLabel }: GeneratedImageResultProps) {
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
          {authorLabel ? <span className="result-author">@{authorLabel}</span> : null}
        </div>
      </article>

      {relatedRows.length > 0 ? (
        <section className="related-gallery">
          <div className="related-header">
            <strong>Explora imágenes relacionadas con tu creación</strong>
          </div>

          {relatedRows.map((row) => (
            <div className="related-section" key={row.title}>
              <p>{row.title}</p>
              <div className="related-grid">
                {row.posts.map((item) =>
                  item.image_url ? (
                    <Link className="related-link" href={buildResultHref(item.id)} key={item.id}>
                      <Image
                        alt={`Referencia visual para: ${item.prompt}`}
                        className="related-image"
                        height={480}
                        src={item.image_url}
                        unoptimized
                        width={480}
                      />
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          ))}

        </section>
      ) : null}
    </section>
  );
}
