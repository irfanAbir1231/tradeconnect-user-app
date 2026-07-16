import Link from "next/link";

const benefits = [
  { number: "01", title: "Find the right partners", text: "Discover trusted suppliers, buyers, and service providers aligned to the way you do business." },
  { number: "02", title: "Move with clarity", text: "Keep every conversation, opportunity, and next step visible in one focused workspace." },
  { number: "03", title: "Grow with confidence", text: "Build repeatable trade relationships backed by practical insights and human support." },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[55rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_68%)] opacity-70" />
        <div className="container-shell grid min-h-[38rem] items-center gap-12 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-[var(--accent-deep)] shadow-sm">
              <span className="size-1.5 rounded-full bg-[var(--accent)]" />
              Trade, connected
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.03] tracking-[-.06em] text-[var(--navy)] sm:text-6xl lg:text-[4.65rem]">The clearer way to <span className="text-[var(--accent-deep)]">move business forward.</span></h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-[var(--muted)]">TradeConnect brings the people, tools, and confidence behind every successful business relationship into one connected experience.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--navy)] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="#contact">Start a conversation <span aria-hidden="true">↗</span></Link>
              <Link className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] bg-white/70 px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition-colors hover:border-[var(--accent-deep)] hover:bg-white" href="#how-it-works">See how it works</Link>
            </div>
            <div className="mt-12 flex items-center gap-4 text-sm text-[var(--muted)]"><span className="flex -space-x-2"><span className="avatar bg-[#d4e8df]">A</span><span className="avatar bg-[#dbe4f1]">M</span><span className="avatar bg-[#f2dfc8]">R</span></span><span>Trusted by ambitious teams across markets</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[31rem]">
            <div className="absolute -inset-4 rounded-[2rem] bg-[var(--accent-soft)] blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/80 bg-[var(--navy)] p-4 shadow-[0_30px_70px_-30px_rgba(5,31,57,.55)] sm:p-5">
              <div className="rounded-2xl bg-[#f8fbfa] p-5 sm:p-6">
                <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">Your network</p><p className="mt-1 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Good momentum</p></div><span className="rounded-full bg-[#dff6ed] px-2.5 py-1 text-xs font-semibold text-[#087456]">+18.4%</span></div>
                <div className="mt-8 flex h-32 items-end gap-2 rounded-xl bg-white px-4 pb-4 pt-5 shadow-sm"><span className="h-[34%] flex-1 rounded-t bg-[#ccece0]" /><span className="h-[49%] flex-1 rounded-t bg-[#9cdbca]" /><span className="h-[42%] flex-1 rounded-t bg-[#ccece0]" /><span className="h-[68%] flex-1 rounded-t bg-[#65c4a9]" /><span className="h-[61%] flex-1 rounded-t bg-[#65c4a9]" /><span className="h-[86%] flex-1 rounded-t bg-[var(--accent)]" /><span className="h-full flex-1 rounded-t bg-[var(--navy)]" /></div>
                <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl border border-[var(--line)] bg-white p-3"><p className="text-xs text-[var(--muted)]">Active partners</p><p className="mt-2 text-xl font-semibold text-[var(--navy)]">248</p></div><div className="rounded-xl border border-[var(--line)] bg-white p-3"><p className="text-xs text-[var(--muted)]">Open opportunities</p><p className="mt-2 text-xl font-semibold text-[var(--navy)]">36</p></div></div>
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-4 text-xs font-medium text-white/60"><span>TradeConnect workspace</span><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[var(--accent)]" />Live view</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white py-16" id="solutions"><div className="container-shell grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">One connected advantage</p><h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-[-.04em] text-[var(--navy)] sm:text-4xl">Relationships are your greatest trade asset.</h2></div><div className="grid gap-8 sm:grid-cols-3">{benefits.map((benefit) => <div key={benefit.number}><p className="text-sm font-semibold text-[var(--accent-deep)]">{benefit.number}</p><h3 className="mt-5 text-lg font-semibold text-[var(--navy)]">{benefit.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{benefit.text}</p></div>)}</div></div></section>

      <section className="container-shell py-20 sm:py-28" id="how-it-works"><div className="rounded-[2rem] bg-[var(--navy)] px-6 py-12 text-center sm:px-12"><p className="eyebrow text-[var(--accent)]">Ready when you are</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">A stronger network starts with one good conversation.</h2><p className="mx-auto mt-5 max-w-xl leading-7 text-white/65">Build the next chapter of your business with a partner that understands the pace and complexity of trade.</p><Link className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition-transform hover:-translate-y-0.5" href="#contact">Talk to TradeConnect <span aria-hidden="true" className="ml-2">↗</span></Link></div></section>
      <div id="resources" />
      <div id="contact" />
    </div>
  );
}
