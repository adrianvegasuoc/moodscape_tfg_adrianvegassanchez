import Link from "next/link";
import type { Route } from "next";

const inspirationTags: Array<{ href: Route; label: string }> = [
  { href: "/explorar/calma" as Route, label: "Calma" },
  { href: "/explorar/recuerdo" as Route, label: "Recuerdo" },
  { href: "/explorar/paisaje" as Route, label: "Paisaje" },
  { href: "/explorar/atardecer" as Route, label: "Atardecer" },
  { href: "/explorar/sueno" as Route, label: "Sueño" },
  { href: "/explorar/familia" as Route, label: "Familia" }
];

export function InspirationCard() {
  return (
    <section className="inspiration-card" aria-labelledby="inspiration-title">
      <div>
        <h2 id="inspiration-title">Inspiración para explorar</h2>
        <p>Descubre conexiones emocionales creadas por la comunidad.</p>
      </div>

      <div className="inspiration-tags" aria-label="Temas destacados">
        {inspirationTags.map((tag) => (
          <Link className="inspiration-tag" href={tag.href} key={tag.href}>
            {tag.label}
          </Link>
        ))}
      </div>

      <Link className="secondary-button inspiration-link" href="/explorar">
        Explorar Moodscape
      </Link>
    </section>
  );
}
