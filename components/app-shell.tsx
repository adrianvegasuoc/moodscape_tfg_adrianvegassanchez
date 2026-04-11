const sections = [
  { href: "/login", label: "Login", description: "Acceso de usuarios." },
  { href: "/register", label: "Registro", description: "Alta de nuevas cuentas." },
  { href: "/dashboard", label: "Dashboard", description: "Zona privada del usuario autenticado." },
  { href: "/crear", label: "Crear", description: "Generacion de nuevas obras." },
  { href: "/explorar", label: "Explorar", description: "Descubrimiento de creaciones." },
  { href: "/perfil", label: "Perfil", description: "Espacio personal del usuario." }
];

export function AppShell() {
  return (
    <main className="page-shell">
      <section className="landing">
        <h1>Moodscape</h1>
        <p>
          Aplicacion web orientada a la expresion emocional mediante arte generativo basado en IA.
        </p>
        <p className="status-message">
          El entorno base esta correctamente configurado y ahora incluye autenticacion basica.
        </p>
      </section>

      <section className="section-block">
        <h2>Secciones previstas</h2>
        <div className="route-grid">
          {sections.map((section) => (
            <a className="route-card" href={section.href} key={section.href}>
              <strong>{section.label}</strong>
              <span>{section.description}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
