import type { Metadata } from "next";
import Link from "next/link";

import { HomeIcon, type HomeIconName } from "@/src/components/home/HomeIcon";
import { SectionHeading } from "@/src/components/home/SectionHeading";

export const metadata: Metadata = {
  title: "Platform",
  description: "One platform for trade requests, supplier matching, and business technology.",
};

const benefits = [
  { icon: "users" as HomeIconName, title: "Faster Partner Discovery", text: "Start with a structured request and reach relevant businesses without searching every channel yourself." },
  { icon: "shield" as HomeIconName, title: "Verified Business Network", text: "See the signals that matter before you invest time in a new supplier, buyer, or service provider." },
  { icon: "chart" as HomeIconName, title: "Centralized Request Tracking", text: "Keep requests, updates, inquiries, and next steps in one clear, easy-to-follow workspace." },
  { icon: "spark" as HomeIconName, title: "Admin-Assisted Matching", text: "Our team helps refine the brief and identify the strongest-fit connections for your goals." },
];

const features = [
  { icon: "package" as HomeIconName, title: "Request Management", text: "Create, organize, and follow trade or technology requests from submission to outcome." },
  { icon: "users" as HomeIconName, title: "Business Matching", text: "Bring the right buyers, suppliers, exporters, and providers into the same conversation." },
  { icon: "shield" as HomeIconName, title: "Company Verification", text: "Build trust with reviewed profiles and clear business information." },
  { icon: "globe" as HomeIconName, title: "Marketplace Listings", text: "Make products, services, and business opportunities easier to discover." },
  { icon: "chart" as HomeIconName, title: "Quotation & Inquiry Flow", text: "Turn interest into structured inquiries that are easier to respond to and compare." },
  { icon: "laptop" as HomeIconName, title: "Technology Product Showcase", text: "Explore software and systems that can improve how your business operates." },
  { icon: "building" as HomeIconName, title: "User Dashboard", text: "See your profile, requests, matches, and activity in one personal view." },
  { icon: "spark" as HomeIconName, title: "Admin Dashboard", text: "Manage verification, matching, requests, and network quality from one control center." },
];

const modules = [
  { number: "01", title: "Import Request System", text: "Share what you need to source and let the network help you find a practical path." },
  { number: "02", title: "Export Opportunity System", text: "Present your products to buyers and partners looking for Bangladesh-connected supply." },
  { number: "03", title: "Local Supply Network", text: "Find manufacturers, distributors, and service providers ready to deliver locally." },
  { number: "04", title: "Technology Support Desk", text: "Get guided toward technology products and partners that fit your operation." },
  { number: "05", title: "Marketplace", text: "Browse a focused view of products, requests, opportunities, and services." },
  { number: "06", title: "Company Directory", text: "Explore verified businesses by capability, industry, location, and market." },
];

const onboardingSteps = [
  "Create account",
  "Complete company profile",
  "Submit request or listing",
  "Get verified",
  "Receive inquiries or matches",
];

function PlatformDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-[var(--accent-soft)] opacity-80 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_35px_80px_-30px_rgba(5,31,57,.55)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3.5 sm:px-5"><div className="flex items-center gap-2.5"><span className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--navy)]"><HomeIcon name="spark" className="size-4" /></span><span className="text-xs font-bold text-[var(--navy)]">TradeConnect</span></div><div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#55b88f]" /><span className="text-[.65rem] font-medium text-[var(--muted)]">All systems active</span></div></div>
        <div className="grid min-h-[27rem] grid-cols-[7.5rem_1fr] sm:grid-cols-[8.5rem_1fr]">
          <aside className="hidden border-r border-[var(--line)] bg-[#f8fbfa] p-3 sm:block"><p className="px-2 py-2 text-[.58rem] font-bold uppercase tracking-[.12em] text-[var(--muted)]">Workspace</p><div className="space-y-1"><div className="flex items-center gap-2 rounded-lg bg-[var(--navy)] px-2.5 py-2 text-[.68rem] font-semibold text-white"><HomeIcon name="chart" className="size-3.5" />Overview</div>{["Requests", "Matches", "Directory", "Products"].map((item) => <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[.68rem] font-medium text-[var(--muted)]" key={item}><span className="size-1.5 rounded-full bg-[var(--line-strong)]" />{item}</div>)}</div><div className="mt-16 rounded-xl bg-[var(--accent-soft)] p-2.5"><p className="text-[.62rem] font-semibold leading-4 text-[var(--navy)]">Need a hand?</p><p className="mt-1 text-[.58rem] leading-3 text-[var(--muted)]">Your TradeConnect team is here.</p></div></aside>
          <div className="min-w-0 bg-white p-4 sm:p-5"><div className="flex items-end justify-between"><div><p className="text-[.62rem] font-bold uppercase tracking-[.12em] text-[var(--muted)]">Good morning, team</p><h3 className="mt-1 text-lg font-semibold tracking-[-.03em] text-[var(--navy)] sm:text-xl">Business overview</h3></div><span className="rounded-lg border border-[var(--line)] px-2 py-1 text-[.62rem] font-medium text-[var(--muted)]">This month⌄</span></div><div className="mt-5 grid grid-cols-2 gap-2.5"><div className="rounded-xl bg-[var(--navy)] p-3 text-white"><p className="text-[.6rem] text-white/55">Active requests</p><p className="mt-2 text-xl font-semibold">12</p><p className="mt-1 text-[.58rem] text-[var(--accent)]">+4 this week</p></div><div className="rounded-xl border border-[var(--line)] p-3"><p className="text-[.6rem] text-[var(--muted)]">New matches</p><p className="mt-2 text-xl font-semibold text-[var(--navy)]">08</p><p className="mt-1 text-[.58rem] text-[#15785f]">Ready to review</p></div></div><div className="mt-5 flex items-end gap-1 rounded-xl bg-[#f8fbfa] px-3 pb-3 pt-4"><div className="mr-2 flex h-24 flex-1 flex-col justify-between text-[.55rem] text-[var(--muted)]"><span>24</span><span>12</span><span>0</span></div><div className="flex h-24 flex-[8] items-end gap-1.5 border-b border-l border-[var(--line)] px-2">{[34, 45, 39, 61, 54, 73, 68, 88].map((height, index) => <span className={`flex-1 rounded-t ${index > 5 ? "bg-[var(--accent-deep)]" : "bg-[#b8dfd0]"}`} style={{ height: `${height}%` }} key={height} />)}</div></div><div className="mt-5 flex items-center justify-between"><p className="text-xs font-semibold text-[var(--navy)]">Recent activity</p><span className="text-[.62rem] font-semibold text-[var(--accent-deep)]">View all</span></div><div className="mt-3 space-y-2">{["Supplier match approved", "New export inquiry received"].map((item, index) => <div className="flex items-center gap-2.5 rounded-lg border border-[var(--line)] p-2.5" key={item}><span className={`flex size-6 items-center justify-center rounded-md ${index === 0 ? "bg-[var(--accent-soft)] text-[var(--accent-deep)]" : "bg-[#e8f0fa] text-[#31658e]"}`}><HomeIcon name={index === 0 ? "check" : "globe"} className="size-3.5" /></span><span className="text-[.65rem] font-medium text-[var(--navy)]">{item}</span><span className="ml-auto text-[.58rem] text-[var(--muted)]">2h</span></div>)}</div></div>
        </div>
      </div>
    </div>
  );
}

export default function PlatformPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative bg-[var(--navy)]" id="platform"><div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(143,226,192,.22),transparent_28%)]" /><div className="container-shell grid items-center gap-14 py-16 lg:grid-cols-[1fr_1fr] lg:py-24"><div className="relative max-w-2xl"><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[.68rem] font-bold uppercase tracking-[.13em] text-[var(--accent)]"><span className="size-1.5 rounded-full bg-[var(--accent)]" />The TradeConnect platform</div><h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-.065em] text-white sm:text-6xl lg:text-[4.35rem]">One platform for <span className="text-[var(--accent)]">trade requests, supplier matching</span> &amp; business technology.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-white/65">Bring your business needs into focus, find the right partners, and keep every important next step moving from one connected workspace.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition-transform hover:-translate-y-0.5" href="#contact">Submit Request <HomeIcon name="arrow" className="size-4" /></Link><Link className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]" href="/#marketplace">Explore Marketplace</Link></div><div className="mt-10 flex items-center gap-3 text-sm text-white/50"><span className="flex size-8 items-center justify-center rounded-full border border-white/15 text-[var(--accent)]"><HomeIcon name="shield" className="size-4" /></span>Built for verified, meaningful connections</div></div><PlatformDashboard /></div></section>

      <section className="border-b border-[var(--line)] bg-white py-16 sm:py-20"><div className="container-shell"><SectionHeading align="center" description="The platform removes friction from the moments that matter most in a business relationship." eyebrow="Why teams use TradeConnect" title="A clearer way to turn intent into action." /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{benefits.map((benefit) => <article className="rounded-2xl border border-[var(--line)] bg-[#fbfdfc] p-5" key={benefit.title}><span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-deep)]"><HomeIcon name={benefit.icon} /></span><h2 className="mt-5 text-base font-semibold text-[var(--navy)]">{benefit.title}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{benefit.text}</p></article>)}</div></div></section>

      <section className="container-shell py-20 sm:py-28" id="features"><SectionHeading description="Every part of the experience is designed to help a real business request move forward with less noise." eyebrow="The platform toolkit" title="The tools behind a stronger business network." /><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <article className="group rounded-2xl border border-[var(--line)] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_18px_38px_-25px_rgba(8,38,63,.45)]" key={feature.title}><span className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--navy)] transition-colors group-hover:bg-[var(--navy)] group-hover:text-[var(--accent)]"><HomeIcon name={feature.icon} /></span><h2 className="mt-5 text-base font-semibold text-[var(--navy)]">{feature.title}</h2><p className="mt-2.5 text-sm leading-6 text-[var(--muted)]">{feature.text}</p></article>)}</div></section>

      <section className="bg-[var(--surface)] py-20 sm:py-28" id="modules"><div className="container-shell"><SectionHeading align="center" description="A modular foundation for the trade, supply, directory, and technology journeys your business already takes." eyebrow="One connected system" title="Everything important has a place." /><div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{modules.map((module) => <article className="flex gap-4 rounded-2xl border border-[var(--line)] bg-white p-5" key={module.number}><span className="text-sm font-bold text-[var(--accent-deep)]">{module.number}</span><div><h2 className="text-base font-semibold text-[var(--navy)]">{module.title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{module.text}</p></div></article>)}</div></div></section>

      <section className="container-shell py-20 sm:py-28" id="onboarding"><div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]"><SectionHeading description="Start small, build a complete business presence, and let the right opportunities come to you." eyebrow="Getting started" title="Onboarding that respects your time." /><div className="relative"><div className="absolute left-5 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-[var(--line-strong)] sm:block" /><div className="space-y-4">{onboardingSteps.map((step, index) => <div className="relative flex items-center gap-5 rounded-2xl border border-[var(--line)] bg-white p-4 sm:gap-6 sm:border-transparent sm:bg-transparent sm:p-0" key={step}><span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] text-sm font-semibold text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span><div className="flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3.5 shadow-[0_10px_24px_-24px_rgba(8,38,63,.6)]"><p className="text-sm font-semibold text-[var(--navy)]">{step}</p><p className="mt-1 text-xs text-[var(--muted)]">{index === 0 ? "Set up your TradeConnect account in minutes." : index === 1 ? "Help partners understand what you do best." : index === 2 ? "Put a clear need or capability into the network." : index === 3 ? "Give businesses confidence before they connect." : "Move from a profile to a practical conversation."}</p></div></div>)}</div></div></div></section>

      <section className="container-shell pb-20 sm:pb-28" id="contact"><div className="relative overflow-hidden rounded-[2rem] bg-[var(--accent)] px-6 py-14 sm:px-12 sm:py-16"><div className="absolute -right-12 -top-24 size-72 rounded-full border-[24px] border-white/15" /><div className="absolute -bottom-28 right-36 size-72 rounded-full border-[24px] border-white/10" /><div className="relative max-w-2xl"><p className="eyebrow text-[var(--navy)]">Your platform is ready</p><h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-.05em] text-[var(--navy)] sm:text-4xl">Make your next business move easier to find.</h2><p className="mt-5 max-w-xl leading-7 text-[var(--navy)]/70">Create your profile, share your request, and let TradeConnect help you build a more connected future.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--navy)] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="#platform">Submit Request <HomeIcon name="arrow" className="size-4" /></Link><Link className="inline-flex items-center justify-center rounded-full border border-[var(--navy)]/20 px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-white/20" href="/#marketplace">Explore Marketplace</Link></div></div></div></section>
    </div>
  );
}
