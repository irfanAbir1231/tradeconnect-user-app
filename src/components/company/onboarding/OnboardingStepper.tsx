type Props = { current: number; labels: readonly string[] };

export function OnboardingStepper({ current, labels }: Props) {
  return <ol aria-label="Company onboarding steps" className="grid gap-2 sm:grid-cols-4">{labels.map((label, index) => <li className={`rounded-xl border px-3 py-2 text-xs font-semibold ${index === current ? "border-[var(--accent-deep)] bg-[var(--accent-soft)] text-[var(--accent-deep)]" : index < current ? "border-[var(--line)] bg-white text-[var(--navy)]" : "border-[var(--line)] bg-[#fbfdfc] text-[var(--muted)]"}`} key={label}><span className="mr-1.5" aria-hidden="true">{index < current ? "✓" : index + 1}</span>{label}</li>)}</ol>;
}
