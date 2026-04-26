import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import type { Post } from "@/types/posts";

type EmotionalMapGalleryProps = {
  compact?: boolean;
  footerHref?: Route;
  footerLabel?: string;
  posts: Post[];
  title: string;
};

function buildResultHref(postId: string) {
  return `/?post_id=${encodeURIComponent(postId)}` as Route;
}

export function EmotionalMapGallery({
  posts,
  title,
  compact = false,
  footerHref,
  footerLabel
}: EmotionalMapGalleryProps) {
  const imagePosts = posts.filter((post) => post.image_url);

  return (
    <section
      className={`emotional-map-panel ${compact ? "emotional-map-panel-compact" : "emotional-map-panel-full"}`}
    >
      <p
        className={`emotional-map-title ${compact ? "emotional-map-title-compact" : "emotional-map-title-full"}`}
      >
        {title}
      </p>

      {imagePosts.length > 0 ? (
        <div
          className={`emotional-map-grid ${compact ? "emotional-map-grid-compact" : "emotional-map-grid-full"}`}
        >
          {imagePosts.map((post) =>
            post.image_url ? (
              <Link className="emotional-map-link" href={buildResultHref(post.id)} key={post.id}>
                <Image
                  alt={`Creacion emocional: ${post.prompt}`}
                  className={`emotional-map-image ${compact ? "emotional-map-image-compact" : "emotional-map-image-full"}`}
                  height={480}
                  src={post.image_url}
                  unoptimized
                  width={480}
                />
              </Link>
            ) : null
          )}
        </div>
      ) : (
        <p className="emotional-map-empty">
          Todavia no has generado imagenes para tus creaciones.
        </p>
      )}

      {footerHref && footerLabel && imagePosts.length > 0 ? (
        <div className="emotional-map-footer">
          <Link className="emotional-map-footer-link" href={footerHref}>
            {footerLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
