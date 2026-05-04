import Link from "next/link";

const howItWorksSteps = [
  "Describe una emoción",
  "Moodscape genera una imagen",
  "Explora conexiones visuales"
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
        <div className="discover-video-placeholder">
          <strong>Aquí se mostrará la demo de la experiencia</strong>
        </div>
        <p>
          Más adelante se incorporará un vídeo explicativo del flujo completo de la plataforma.
        </p>
      </section>

      <section className="discover-steps-section" id="como-funciona">
        <div className="discover-section-heading">
          <h2>Cómo funciona</h2>
        </div>
        <div className="discover-steps-grid">
          {howItWorksSteps.map((step, index) => (
            <article className="discover-step-card" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
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
