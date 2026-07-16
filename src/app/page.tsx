import Link from "next/link";

import { HomeIcon, type HomeIconName } from "@/src/components/home/HomeIcon";
import { SectionHeading } from "@/src/components/home/SectionHeading";

const stats = [
  { value: "1,200+", label: "Verified companies", icon: "building" as HomeIconName },
  { value: "480+", label: "Open opportunities", icon: "chart" as HomeIconName },
  { value: "18", label: "Countries covered", icon: "globe" as HomeIconName },
  { value: "96", label: "Technology products", icon: "laptop" as HomeIconName },
];

const solutions = [
  { icon: "package" as HomeIconName, title: "Import Products", text: "Source products from trusted international suppliers and turn a clear request into a confident purchase." },
  { icon: "chart" as HomeIconName, title: "Export Products", text: "Put your products in front of serious buyers looking for reliable Bangladesh-made supply." },
  { icon: "building" as HomeIconName, title: "Supply in Bangladesh", text: "Connect with local distributors, manufacturers, and service partners who can help you deliver." },
  { icon: "laptop" as HomeIconName, title: "Technology Support", text: "Find practical technology products and implementation partners built for business growth." },
];

const steps = [
  { number: "01", title: "Submit Request", text: "Tell us what you need, where you need it, and when you want to move." },
  { number: "02", title: "Admin Reviews", text: "Our team checks the request and clarifies the details that matter." },
  { number: "03", title: "Get Verified", text: "Business information is reviewed to keep the network reliable." },
  { number: "04", title: "Match with Partner", text: "We identify relevant suppliers, buyers, or technology providers." },
  { number: "05", title: "Start Business", text: "Connect directly and take the next step with confidence." },
];

const opportunities = [
  { type: "Import Request", title: "Premium jute bags for retail distribution", location: "Bangladesh · Dhaka", timing: "Closes in 12 days", tag: "Verified buyer", icon: "package" as HomeIconName },
  { type: "Export Opportunity", title: "Ready-to-ship leather goods manufacturer", location: "Bangladesh · Chattogram", timing: "Open for partners", tag: "Verified supplier", icon: "globe" as HomeIconName },
  { type: "Supplier Match", title: "Industrial automation parts & support", location: "Bangladesh · Gazipur", timing: "3 partner matches", tag: "Technology", icon: "laptop" as HomeIconName },
];

const reasons = [
  "Verified business profiles",
  "Structured request system",
  "Admin-managed matching",
  "Trade + technology in one place",
];

const products = [
  { category: "Business software", title: "Inventory & order management", description: "See stock, purchase orders, and fulfilment in one place.", accent: "bg-[#e5f7ef]", icon: "chart" as HomeIconName },
  { category: "Operations", title: "Smart warehouse starter kit", description: "Practical hardware and software for a more visible operation.", accent: "bg-[#e8f0fa]", icon: "package" as HomeIconName },
  { category: "Connectivity", title: "Secure team communications", description: "Keep teams and partners aligned wherever work takes you.", accent: "bg-[#f5eddc]", icon: "users" as HomeIconName },
];

function ArrowLink({ children, href = "#contact" }: { children: React.ReactNode; href?: string }) {
  return <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-deep)] transition-colors hover:text-[var(--navy)]" href={href}>{children}<HomeIcon name="arrow" className="size-4" /></Link>;
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative" id="platform">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_12%,var(--accent-soft),transparent_28%),linear-gradient(180deg,#f7faf9_0%,#ffffff_78%)]" />
        <div className="absolute right-[-12rem] top-8 -z-10 size-[35rem] rounded-full border border-[var(--line)] opacity-60" />
        <div className="container-shell grid min-h-[42rem] items-center gap-14 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-3.5 py-2 text-[.68rem] font-bold uppercase tracking-[.13em] text-[var(--accent-deep)] shadow-sm"><span className="size-1.5 rounded-full bg-[var(--accent-deep)]" />Bangladesh-focused B2B Trade &amp; Business Platform</div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-.065em] text-[var(--navy)] sm:text-6xl lg:text-[4.65rem]">Connect the businesses that <span className="text-[var(--accent-deep)]">move Bangladesh forward.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">Submit a business request, get verified, and connect with trusted importers, exporters, suppliers, and technology partners—all through one focused platform.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent-deep)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_var(--accent-deep)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--navy)]" href="#contact">Submit a Request <HomeIcon name="arrow" className="size-4" /></Link><Link className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] bg-white/70 px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition-colors hover:border-[var(--accent-deep)] hover:bg-white" href="#marketplace">Explore Opportunities</Link></div>
            <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--muted)]"><span className="flex -space-x-2"><span className="avatar bg-[#d4e8df]">I</span><span className="avatar bg-[#dbe4f1]">E</span><span className="avatar bg-[#f2dfc8]">S</span></span><span>Trusted by teams building across borders</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[var(--accent-soft)] opacity-80 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/90 bg-[var(--navy)] p-3.5 shadow-[0_35px_80px_-30px_rgba(5,31,57,.65)] sm:p-5">
              <div className="rounded-[1.25rem] bg-[#f7fbf9] p-4 sm:p-5">
                <div className="flex items-start justify-between border-b border-[var(--line)] pb-5"><div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[var(--accent-deep)]" /><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">TradeConnect workspace</p></div><p className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Your business, connected</p></div><span className="rounded-full bg-[#dff6ed] px-2.5 py-1 text-xs font-semibold text-[#087456]">Live</span></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[{ label: "Import Request", detail: "Textile sourcing · Dhaka", icon: "package" as HomeIconName, color: "bg-[#e5f7ef] text-[#15785f]" }, { label: "Export Opportunity", detail: "Leather goods · Chattogram", icon: "globe" as HomeIconName, color: "bg-[#e8f0fa] text-[#31658e]" }, { label: "Supplier Match", detail: "3 relevant partners", icon: "users" as HomeIconName, color: "bg-[#f5eddc] text-[#9b6b28]" }, { label: "Technology Support", detail: "Inventory systems · Ready", icon: "laptop" as HomeIconName, color: "bg-[#eee8f7] text-[#7154a4]" }].map((card) => <div className="rounded-xl border border-[var(--line)] bg-white p-3.5 transition-transform hover:-translate-y-0.5" key={card.label}><div className="flex items-start justify-between"><span className={`flex size-9 items-center justify-center rounded-lg ${card.color}`}><HomeIcon name={card.icon} /></span><span className="mt-1 size-1.5 rounded-full bg-[#55b88f]" /></div><p className="mt-4 text-sm font-semibold text-[var(--navy)]">{card.label}</p><p className="mt-1 text-xs text-[var(--muted)]">{card.detail}</p></div>)}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-[var(--navy)] px-4 py-3.5 text-white"><div><p className="text-xs text-white/55">Network activity</p><p className="mt-1 text-sm font-semibold">42 new connections this week</p></div><div className="flex items-end gap-1"><span className="h-3 w-1.5 rounded-t bg-white/40" /><span className="h-5 w-1.5 rounded-t bg-white/55" /><span className="h-4 w-1.5 rounded-t bg-white/70" /><span className="h-7 w-1.5 rounded-t bg-[var(--accent)]" /><span className="h-9 w-1.5 rounded-t bg-[var(--accent)]" /></div></div>
              </div>
              <div className="flex items-center justify-between px-2 pb-0 pt-4 text-xs font-medium text-white/55"><span>One platform, many possibilities</span><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[var(--accent)]" />Secure workspace</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white" aria-label="TradeConnect platform statistics">
        <div className="container-shell grid grid-cols-2 divide-x divide-y divide-[var(--line)] sm:grid-cols-4 sm:divide-y-0">{stats.map((stat) => <div className="flex items-center gap-3 px-4 py-6 first:pl-0 sm:justify-center sm:px-5 sm:py-7" key={stat.label}><span className="hidden size-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-deep)] sm:flex"><HomeIcon name={stat.icon} className="size-[1.1rem]" /></span><div><p className="text-xl font-semibold tracking-[-.04em] text-[var(--navy)] sm:text-2xl">{stat.value}</p><p className="mt-1 text-[.68rem] font-semibold uppercase tracking-[.08em] text-[var(--muted)]">{stat.label}</p></div></div>)}</div>
      </section>

      <section className="container-shell py-20 sm:py-28" id="solutions"><SectionHeading description="Whether you are sourcing, supplying, expanding, or upgrading, TradeConnect gives your next business move a clearer starting point." eyebrow="Built around your next move" title="One platform for the way trade actually works." /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{solutions.map((solution, index) => <article className={`group rounded-2xl border border-[var(--line)] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_18px_38px_-25px_rgba(8,38,63,.5)] ${index === 0 ? "border-t-2 border-t-[var(--accent-deep)]" : ""}`} key={solution.title}><span className="flex size-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-deep)] transition-colors group-hover:bg-[var(--navy)] group-hover:text-[var(--accent)]"><HomeIcon name={solution.icon} /></span><h3 className="mt-6 text-lg font-semibold tracking-[-.02em] text-[var(--navy)]">{solution.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{solution.text}</p><ArrowLink href="#contact">Learn more</ArrowLink></article>)}</div></section>

      <section className="bg-[var(--navy)] py-20 sm:py-28" id="how-it-works"><div className="container-shell"><SectionHeading align="center" description="A simple, guided process that keeps the right people focused on the right opportunity." eyebrow="From request to relationship" title="Make your next business connection count." /><div className="relative mt-14 grid gap-8 md:grid-cols-5 md:gap-4">{steps.map((step, index) => <div className="relative text-center md:text-left" key={step.number}><div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--navy)] text-sm font-bold text-[var(--accent)] md:mx-0">{step.number}</div><h3 className="mt-5 text-base font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{step.text}</p>{index < steps.length - 1 ? <span className="absolute left-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-2rem)] bg-white/15 md:block" /> : null}</div>)}</div></div></section>

      <section className="container-shell py-20 sm:py-28" id="marketplace"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading description="A preview of the requests and opportunities moving through the TradeConnect network." eyebrow="Live from the network" title="Find the next opportunity." /><ArrowLink href="#contact">View all opportunities</ArrowLink></div><div className="mt-12 grid gap-4 lg:grid-cols-3">{opportunities.map((opportunity) => <article className="flex flex-col rounded-2xl border border-[var(--line)] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_38px_-25px_rgba(8,38,63,.5)]" key={opportunity.title}><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.08em] text-[var(--accent-deep)]"><span className="flex size-8 items-center justify-center rounded-lg bg-[var(--accent-soft)]"><HomeIcon name={opportunity.icon} className="size-4" /></span>{opportunity.type}</span><span className="rounded-full bg-[#edf7f2] px-2.5 py-1 text-[.65rem] font-bold text-[#15785f]">{opportunity.tag}</span></div><h3 className="mt-6 min-h-14 text-lg font-semibold leading-6 tracking-[-.02em] text-[var(--navy)]">{opportunity.title}</h3><div className="mt-6 space-y-2 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]"><p className="flex items-center gap-2"><HomeIcon name="globe" className="size-3.5" />{opportunity.location}</p><p className="flex items-center gap-2"><HomeIcon name="chart" className="size-3.5" />{opportunity.timing}</p></div><Link className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-sm font-semibold text-[var(--navy)]" href="#contact">View opportunity <HomeIcon name="arrow" className="size-4 text-[var(--accent-deep)]" /></Link></article>)}</div></section>

      <section className="border-y border-[var(--line)] bg-white py-20 sm:py-28"><div className="container-shell grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><SectionHeading description="Trade is built on trust. We make the steps between a good introduction and a real business relationship easier to navigate." eyebrow="Why TradeConnect" title="Built for business people, not busywork." /><div className="mt-8 grid gap-4 sm:grid-cols-2">{reasons.map((reason) => <div className="flex items-center gap-3 text-sm font-semibold text-[var(--navy)]" key={reason}><span className="flex size-6 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-deep)]"><HomeIcon name="check" className="size-3.5" /></span>{reason}</div>)}</div></div><div className="relative rounded-[1.75rem] bg-[var(--surface)] p-6 sm:p-8"><div className="absolute right-8 top-8 size-20 rounded-full border border-[var(--line-strong)]" /><div className="relative max-w-md"><span className="flex size-12 items-center justify-center rounded-xl bg-[var(--navy)] text-[var(--accent)]"><HomeIcon name="shield" /></span><p className="mt-7 text-3xl font-semibold leading-tight tracking-[-.045em] text-[var(--navy)]">Confidence at every step of the connection.</p><div className="mt-8 space-y-3"><div className="flex items-center justify-between rounded-xl bg-white p-3.5"><span className="flex items-center gap-3 text-sm font-semibold text-[var(--navy)]"><span className="size-2 rounded-full bg-[var(--accent-deep)]" />Business profile</span><span className="text-xs font-bold text-[var(--accent-deep)]">Verified</span></div><div className="flex items-center justify-between rounded-xl bg-white p-3.5"><span className="flex items-center gap-3 text-sm font-semibold text-[var(--navy)]"><span className="size-2 rounded-full bg-[var(--accent-deep)]" />Partner match</span><span className="text-xs font-bold text-[var(--accent-deep)]">3 found</span></div></div></div></div></div></section>

      <section className="container-shell py-20 sm:py-28" id="technology-products"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading description="Practical technology products and services that help businesses operate with more visibility and less friction." eyebrow="Beyond trade" title="Technology that keeps you moving." /><ArrowLink href="#contact">Explore technology</ArrowLink></div><div className="mt-12 grid gap-4 lg:grid-cols-3">{products.map((product) => <article className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white" key={product.title}><div className={`flex h-32 items-center justify-center ${product.accent}`}><span className="flex size-16 items-center justify-center rounded-2xl bg-white/80 text-[var(--navy)] shadow-sm transition-transform group-hover:scale-105"><HomeIcon name={product.icon} className="size-7" /></span></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-[.1em] text-[var(--accent-deep)]">{product.category}</p><h3 className="mt-3 text-lg font-semibold tracking-[-.02em] text-[var(--navy)]">{product.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.description}</p><ArrowLink href="#contact">View product</ArrowLink></div></article>)}</div></section>

      <section className="container-shell pb-20 sm:pb-28" id="contact"><div className="relative overflow-hidden rounded-[2rem] bg-[var(--accent)] px-6 py-14 sm:px-12 sm:py-16"><div className="absolute -right-12 -top-24 size-72 rounded-full border-[24px] border-white/15" /><div className="absolute -bottom-28 right-36 size-72 rounded-full border-[24px] border-white/10" /><div className="relative max-w-2xl"><p className="eyebrow text-[var(--navy)]">Your next move starts here</p><h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-.05em] text-[var(--navy)] sm:text-4xl">Have a request? Let&apos;s make the right connection.</h2><p className="mt-5 max-w-xl leading-7 text-[var(--navy)]/70">Tell us what your business needs and our team will help you find a trusted path forward.</p><Link className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--navy)] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="#platform">Submit a Request <HomeIcon name="arrow" className="size-4" /></Link></div></div></section>
      <div id="directory" />
      <div id="resources" />
    </div>
  );
}
