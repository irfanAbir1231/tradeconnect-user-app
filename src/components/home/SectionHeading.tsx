type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-.045em] text-[var(--navy)] sm:text-4xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-7 text-[var(--muted)]">{description}</p> : null}
    </div>
  );
}
