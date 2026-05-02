import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div>
          <strong>Moodscape</strong>
          <p>Expresión emocional mediante arte generativo</p>
        </div>

        <p className="app-footer-credit">TFG · Adrián Vegas Sánchez</p>

        <nav aria-label="Pie de pagina" className="app-footer-links">
          <Link href="/explorar">Explorar</Link>
          <Link href="/mi-mapa-emocional">Mis creaciones</Link>
        </nav>
      </div>
    </footer>
  );
}
