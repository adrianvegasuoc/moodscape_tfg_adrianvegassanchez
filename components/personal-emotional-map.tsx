import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { buildTrendingTerms, extractPromptTerms } from "@/lib/supabase/posts";
import type { Post } from "@/types/posts";

type PersonalEmotionalMapProps = {
  posts: Post[];
};

const fallbackEmotionTags = ["Paseo", "Fiesta", "Naturaleza", "Familia", "Recuerdo"];

function buildResultHref(postId: string) {
  return `/?post_id=${encodeURIComponent(postId)}` as Route;
}

function formatTag(term: string) {
  return `#${term.charAt(0).toLocaleUpperCase("es-ES")}${term.slice(1)}`;
}

function buildExploreTermHref(term: string) {
  return `/explorar/${encodeURIComponent(term.toLocaleLowerCase("es-ES"))}` as Route;
}

function buildPromptTitle(prompt: string) {
  const trimmedPrompt = prompt.trim();

  if (trimmedPrompt.length <= 58) {
    return trimmedPrompt;
  }

  return `${trimmedPrompt.slice(0, 55).trim()}...`;
}

function formatLastCreation(posts: Post[]) {
  const latestPost = posts[0];

  if (!latestPost?.created_at) {
    return "Sin actividad";
  }

  const createdAt = new Date(latestPost.created_at);
  const today = new Date();
  const isToday = createdAt.toDateString() === today.toDateString();

  if (isToday) {
    return "hoy";
  }

  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long"
  }).format(createdAt);
}

function EmotionalSummary({ posts }: PersonalEmotionalMapProps) {
  const imagePosts = posts.filter((post) => post.image_url);
  // Las estadísticas se derivan de posts con imagen para reflejar solo creaciones completadas.
  const frequentTags = buildTrendingTerms(imagePosts, 2);
  const summaryItems = [
    {
      label: "momentos creados",
      value: imagePosts.length.toString()
    },
    {
      label: "etiquetas frecuentes",
      value: frequentTags.length.toString()
    },
    {
      label: "Última creación",
      value: formatLastCreation(imagePosts)
    }
  ];

  return (
    <section className="personal-summary-grid" aria-label="Resumen personal">
      {summaryItems.map((item) => (
        <article className="personal-summary-card" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </article>
      ))}
    </section>
  );
}

function PersonalCreationCard({ post }: { post: Post }) {
  const tags = extractPromptTerms(post.prompt, 2);

  if (!post.image_url) {
    return null;
  }

  return (
    <Link className="personal-creation-card" href={buildResultHref(post.id)}>
      <span className="personal-creation-media">
        <Image
          alt={`Momento emocional: ${post.prompt}`}
          className="personal-creation-image"
          height={520}
          src={post.image_url}
          unoptimized
          width={520}
        />
      </span>
      <span className="personal-creation-meta">
        <strong>{buildPromptTitle(post.prompt)}</strong>
        {tags.length > 0 ? (
          <span className="personal-creation-tags">
            {tags.map((tag) => (
              <span key={tag}>{formatTag(tag)}</span>
            ))}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function EmptyCreationsState() {
  return (
    <section className="personal-empty-state">
      <h2>Aún no has creado ningún momento</h2>
      <p>Empieza describiendo una emoción, un recuerdo o una sensación.</p>
      <Link className="primary-button personal-empty-link" href="/">
        Crear mi primera imagen
      </Link>
    </section>
  );
}

export function PersonalEmotionalMap({ posts }: PersonalEmotionalMapProps) {
  const imagePosts = posts.filter((post) => post.image_url);
  const recurringTags = buildTrendingTerms(imagePosts, 5);
  // Mientras no haya suficientes datos reales, mantenemos chips de apoyo para no dejar la sección vacía.
  const emotionTags = recurringTags.length > 0 ? recurringTags : fallbackEmotionTags;

  return (
    <>
      <section className="personal-map-hero" aria-labelledby="personal-map-title">
        <h1 id="personal-map-title">Tu mapa emocional</h1>
        <p>
          Un recorrido visual por las emociones, recuerdos y momentos que has transformado en
          imagen.
        </p>
      </section>

      <EmotionalSummary posts={imagePosts} />

      {imagePosts.length > 0 ? (
        <>
          <section className="personal-gallery" aria-label="Galería personal">
            {imagePosts.map((post) => (
              <PersonalCreationCard key={post.id} post={post} />
            ))}
          </section>

          <section className="personal-tags-panel" aria-labelledby="personal-tags-title">
            <h2 id="personal-tags-title">Explora tus emociones recurrentes</h2>
            <div className="personal-tag-list">
              {emotionTags.map((tag) => (
                <Link
                  aria-label={`Explorar creaciones relacionadas con ${tag}`}
                  className="personal-tag"
                  href={buildExploreTermHref(tag)}
                  key={tag}
                >
                  {formatTag(tag)}
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : (
        <EmptyCreationsState />
      )}
    </>
  );
}
