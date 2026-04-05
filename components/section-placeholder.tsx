type SectionPlaceholderProps = {
  title: string;
  description: string;
};

export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <main className="page-shell">
      <section className="landing">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  );
}
