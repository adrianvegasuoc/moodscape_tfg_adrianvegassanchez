import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import type { Post } from "@/types/posts";

type ExploreTrend = {
  posts: Post[];
  term: string;
};

type ExploreOverviewProps = {
  trends: ExploreTrend[];
};

type ExploreDetailProps = {
  currentTerm: string;
  isExpanded: boolean;
  posts: Post[];
  trends: string[];
};

function formatTrendLabel(term: string) {
  return `#${term.charAt(0).toLocaleUpperCase("es-ES")}${term.slice(1)}`;
}

function formatSectionTitle(term: string) {
  return formatTrendLabel(term);
}

function buildExploreTermHref(term: string) {
  return `/explorar/${encodeURIComponent(term)}` as Route;
}

function buildResultHref(postId: string) {
  return `/?post_id=${encodeURIComponent(postId)}` as Route;
}

export function ExploreOverview({ trends }: ExploreOverviewProps) {
  const heroTrends = trends.slice(0, 3);
  const secondaryTrends = trends.slice(3, 5);
  const trendTerms = trends.slice(0, 6).map((trend) => trend.term);

  return (
    <main className="page-shell explore-page">
      <section className="explore-intro" aria-labelledby="explore-title">
        <h1 id="explore-title">Explora el paisaje emocional colectivo</h1>
        <p>Descubre imágenes creadas a partir de emociones, recuerdos y momentos compartidos.</p>
      </section>

      {heroTrends.length > 0 ? (
        <section className="explore-section explore-hero-panel" aria-labelledby="explore-trends-title">
          <div className="explore-section-heading">
            <h2 id="explore-trends-title">Tendencias destacadas</h2>
            <p>Entra en las emociones que más se están compartiendo ahora.</p>
          </div>
          <div className="trend-hero-grid">
            {heroTrends.map((trend) => {
              const featuredPost = trend.posts[0];

              if (!featuredPost?.image_url) {
                return null;
              }

              return (
                <Link className="trend-hero-card" href={buildExploreTermHref(trend.term)} key={trend.term}>
                  <span className="trend-hero-media">
                    <Image
                      alt={`Tendencia ${trend.term}`}
                      className="trend-hero-image"
                      height={420}
                      src={featuredPost.image_url}
                      unoptimized
                      width={420}
                    />
                    <span className="trend-hero-label">{formatTrendLabel(trend.term)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {secondaryTrends.length > 0 ? (
        <section className="explore-secondary-grid" aria-label="Categorias para descubrir">
          {secondaryTrends.map((trend) => (
            <article className="explore-strip" key={trend.term}>
              <div className="explore-strip-heading">
                <h2>{formatSectionTitle(trend.term)}</h2>
              </div>
              <div className="explore-strip-images">
                {trend.posts.slice(0, 3).map((post) =>
                  post.image_url ? (
                    <Link className="explore-strip-link" href={buildExploreTermHref(trend.term)} key={post.id}>
                      <Image
                        alt={`Imagen relacionada con ${trend.term}`}
                        className="explore-strip-image"
                        height={280}
                        src={post.image_url}
                        unoptimized
                        width={280}
                      />
                    </Link>
                  ) : null
                )}
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {trendTerms.length > 0 ? (
        <section className="trend-tags-panel" aria-labelledby="trend-tags-title">
          <div className="explore-section-heading">
            <h2 id="trend-tags-title">Explora por emoción</h2>
          </div>
          <div className="trend-tag-grid">
            {trendTerms.map((term) => (
              <Link className="trend-tag-card" href={buildExploreTermHref(term)} key={term}>
                {formatTrendLabel(term)}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function ExploreDetail({ currentTerm, posts, trends, isExpanded }: ExploreDetailProps) {
  const visiblePosts = posts.length <= 3 ? posts : posts.slice(0, isExpanded ? 18 : 6);
  const shouldShowMoreButton = !isExpanded && posts.length > 6;

  return (
    <main className="page-shell explore-page">
      <section className="explore-detail-panel">
        <div className="explore-detail-heading">
          <h1>{formatSectionTitle(currentTerm)}</h1>
          <p>
            Creaciones relacionadas con {currentTerm}, calma y momentos compartidos.
          </p>
        </div>

        <div className="explore-detail-grid">
          {visiblePosts.map((post) =>
            post.image_url ? (
              <Link className="explore-detail-link" href={buildResultHref(post.id)} key={post.id}>
                <Image
                  alt={`Imagen relacionada con ${currentTerm}`}
                  className="explore-detail-image"
                  height={520}
                  src={post.image_url}
                  unoptimized
                  width={520}
                />
              </Link>
            ) : null
          )}
        </div>

        {shouldShowMoreButton ? (
          <Link
            className="more-chip-button explore-more-button"
            href={`${buildExploreTermHref(currentTerm)}?view=expanded` as Route}
          >
            Ver más
          </Link>
        ) : null}
      </section>

      {trends.length > 0 ? (
        <section className="trend-tags-panel" aria-labelledby="detail-trend-tags-title">
          <div className="explore-section-heading">
            <h2 id="detail-trend-tags-title">Seguir explorando</h2>
          </div>
          <div className="trend-tag-grid">
            {trends.map((term) => (
              <Link className="trend-tag-card" href={buildExploreTermHref(term)} key={term}>
                {formatTrendLabel(term)}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
