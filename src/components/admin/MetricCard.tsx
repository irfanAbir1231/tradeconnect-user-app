type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
  accent?: "green" | "blue" | "amber" | "purple";
};

const accentClasses = {
  green: "bg-[var(--accent-soft)] text-[var(--accent-deep)]",
  blue: "bg-[#e8f0fa] text-[#31658e]",
  amber: "bg-[#fff4db] text-[#9b6b28]",
  purple: "bg-[#eee8f7] text-[#7154a4]",
};

export function MetricCard({ label, value, detail, accent = "green" }: MetricCardProps) {
  return <article className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">{label}</p>
      <span aria-hidden="true" className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${accentClasses[accent]}`}>
        <span className="size-2 rounded-full bg-current" />
      </span>
    </div>
    <p className="mt-5 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)]">{value}</p>
    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{detail}</p>
  </article>;
}
