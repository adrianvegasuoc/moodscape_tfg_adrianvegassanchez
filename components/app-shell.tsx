const sections = [
  { href: "/dashboard", label: "Crear", description: "Genera piezas visuales desde un prompt emocional." },
  { href: "/explorar", label: "Explorar", description: "Descubre tendencias, referencias y atmosferas visuales." },
  { href: "/login", label: "Acceder", description: "Entra para guardar historial y continuar creando." }
];

export function AppShell() {
  return (
    <main className="page-shell">
      <section className="landing">
        <h1>Moodscape</h1>
        <p>
          Expresion emocional mediante imagen generativa, con una experiencia limpia, centrada y contemplativa.
        </p>
        <p className="status-message">
          MVP funcional con autenticacion, generacion de imagenes e historial personal.
        </p>
      </section>

      <section className="section-block">
        <h2>Recorridos principales</h2>
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
