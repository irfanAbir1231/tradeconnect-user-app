export type AnalyticsDatum = { label: string; value: number };

type AnalyticsChartProps = {
  title: string;
  description?: string;
  data: AnalyticsDatum[];
  kind?: "line" | "bar";
  color?: string;
  valueLabel?: string;
};

export function AnalyticsChart({ title, description, data, kind = "bar", color = "#0f766e", valueLabel = "requests" }: AnalyticsChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => `${data.length === 1 ? 320 : (index / (data.length - 1)) * 600 + 20},${188 - (item.value / max) * 148}`).join(" ");
  const chartId = `chart-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7">
    <div><h2 className="text-lg font-semibold tracking-[-.03em] text-[var(--navy)]">{title}</h2>{description ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}</div>
    <div className="mt-6" id={chartId} role="img" aria-label={`${title}: ${data.map((item) => `${item.label} ${item.value} ${valueLabel}`).join(", ")}`}>
      <svg aria-hidden="true" className="h-52 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 640 220">
        {[40, 89, 138, 187].map((y) => <line key={y} stroke="#e5ece9" strokeDasharray="4 6" x1="20" x2="620" y1={y} y2={y} />)}
        {kind === "line" ? <><polyline fill="none" points={points} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />{data.map((item, index) => { const x = data.length === 1 ? 320 : (index / (data.length - 1)) * 600 + 20; const y = 188 - (item.value / max) * 148; return <circle cx={x} cy={y} fill="white" key={item.label} r="5" stroke={color} strokeWidth="3" />; })}</> : data.map((item, index) => { const width = Math.max(12, 520 / Math.max(data.length, 1)); const x = 60 + index * (560 / Math.max(data.length, 1)); const height = (item.value / max) * 148; return <rect fill={color} height={height} key={item.label} rx="7" width={width} x={x} y={188 - height} />; })}
      </svg>
      <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))` }}>{data.map((item) => <div className="min-w-0 text-center" key={item.label}><p className="truncate text-[.68rem] font-semibold text-[var(--muted)]">{item.label}</p><p className="mt-1 text-xs font-bold text-[var(--navy)]">{item.value}</p></div>)}</div>
      <ul className="sr-only">{data.map((item) => <li key={item.label}>{item.label}: {item.value} {valueLabel}</li>)}</ul>
    </div>
  </section>;
}
