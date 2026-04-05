import { FeatureCard } from "@/components/feature-card";

type AppShellProps = {
  userEmail: string | null;
};

const features = [
  {
    title: "Autenticacion y perfil",
    description:
      "Base preparada para conectar login, sesion y permisos con Supabase Auth."
  },
  {
    title: "Prompts emocionales",
    description:
      "Estructura lista para recibir lenguaje natural y transformarlo en solicitudes de generacion."
  },
  {
    title: "Galeria colectiva",
    description:
      "Carpetas y tipos pensados para listar creaciones por etiquetas, categorias y autor."
  }
];

const stack = [
  {
    name: "Next.js App Router",
    description: "Aplicacion web moderna preparada para despliegue en Vercel."
  },
  {
    name: "TypeScript",
    description: "Tipado estricto desde el arranque para mantener un MVP ordenado."
  },
  {
    name: "Supabase",
    description: "Clientes de navegador, servidor y middleware listos para integracion."
  },
  {
    name: "OpenAI-ready",
    description: "Capa de servicios preparada para conectar generacion de imagenes despues."
  }
];

export function AppShell({ userEmail }: AppShellProps) {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Moodscape MVP</p>
        <h1>Arte generativo para expresar emociones.</h1>
        <p>
          Este proyecto ya tiene la base tecnica para autenticacion, persistencia,
          exploracion de creaciones y futura generacion de imagenes con OpenAI.
        </p>
        <div className="hero-actions">
          <a className="hero-action" href="https://vercel.com/new" target="_blank" rel="noreferrer">
            Desplegar en Vercel
          </a>
          <a className="hero-secondary" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
            Configurar Supabase
          </a>
        </div>
        <div className="status-pill">
          {userEmail ? `Sesion detectada: ${userEmail}` : "Sin sesion activa"}
        </div>
      </section>

      <p className="section-heading">Capacidades previstas</p>
      <section className="section-grid feature-grid">
        {features.map((feature) => (
          <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
        ))}
      </section>

      <p className="section-heading">Stack base</p>
      <section className="section-grid stack-grid">
        {stack.map((item) => (
          <article className="card stack-item" key={item.name}>
            <strong>{item.name}</strong>
            <span>{item.description}</span>
          </article>
        ))}
      </section>

      <section className="section-grid" style={{ marginTop: "1.5rem" }}>
        <article className="card">
          <h2>Estructura inicial</h2>
          <ul>
            <li>`app/` para rutas y layouts con App Router.</li>
            <li>`components/` para UI reutilizable.</li>
            <li>`lib/` para configuracion, entorno y clientes.</li>
            <li>`services/` para integraciones externas como OpenAI.</li>
            <li>`types/` para contratos compartidos y tipos de base de datos.</li>
          </ul>
        </article>
      </section>

      <p className="footer-note">
        Configura las variables de entorno y ya puedes continuar con auth, tablas, storage
        y la capa de negocio del MVP.
      </p>
    </main>
  );
}
