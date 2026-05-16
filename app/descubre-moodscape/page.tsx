import Link from "next/link";

const howItWorksSteps = [
  {
    title: "Describe una emoción",
    subtitle: "Mañana de domingo en el rastro de Madrid"
  },
  {
    title: "Moodscape genera una imagen",
    subtitle: "La IA interpreta tu recuerdo y lo convierte en una escena visual única"
  },
  {
    title: "Explora conexiones visuales",
    subtitle: "Descubre momentos afines creados por otras personas y emociones compartidas"
  }
];

export default function DiscoverMoodscapePage() {
  return (
    <main className="page-shell discover-page">
      <section className="discover-hero" aria-labelledby="discover-title">
        <h1 id="discover-title">Descubre Moodscape</h1>
        <p>
          Una forma visual de transformar emociones, recuerdos y momentos en arte generativo.
        </p>
      </section>

      <section className="discover-video-section" aria-label="Demo de Moodscape">
        <div className="discover-video-frame">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://www.youtube.com/embed/kTyfu_yJ5ms"
            title="Demo de Moodscape"
          />
        </div>
      </section>

      <section className="discover-steps-section" id="como-funciona">
        <div className="discover-section-heading">
          <h2>Cómo funciona</h2>
        </div>
        <div className="discover-steps-grid">
          {howItWorksSteps.map((step, index) => (
            <article className="discover-step-card" key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="discover-cta" aria-label="Comenzar en Moodscape">
        <Link className="primary-button discover-cta-button" href="/register">
          Crear mi cuenta
        </Link>
        <Link className="secondary-button discover-cta-button" href="/login">
          Iniciar sesión
        </Link>
      </section>
    </main>
  );
}
