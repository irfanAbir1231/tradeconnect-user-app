import type { Metadata } from "next";
import Link from "next/link";

import { HomeIcon } from "@/src/components/home/HomeIcon";
import { MarketplaceBrowser } from "@/src/components/marketplace/MarketplaceBrowser";
import { opportunities } from "@/src/data/opportunities";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Explore open import requests, export opportunities, local supply needs, and technology projects.",
};

export default function MarketplacePage() {
  const categories = [...new Set(opportunities.map((opportunity) => opportunity.category))];
  const locations = [...new Set(opportunities.map((opportunity) => opportunity.location))];

  return (
    <div className="overflow-hidden">
      <section className="relative bg-[var(--navy)]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(143,226,192,.2),transparent_28%)]" /><div className="container-shell py-20 sm:py-28"><div className="relative max-w-3xl"><Link className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-white/55 transition-colors hover:text-[var(--accent)]" href="/"><span aria-hidden="true">←</span> TradeConnect home</Link><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[var(--accent)]"><span className="size-1.5 rounded-full bg-[var(--accent)]" />Live business network</div><h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-.065em] text-white sm:text-6xl lg:text-[4.65rem]">Explore open <span className="text-[var(--accent)]">business opportunities.</span></h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">Discover import requests, export opportunities, local supply needs, and technology projects moving through the TradeConnect network.</p><div className="mt-9 flex flex-wrap gap-3"><Link className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--navy)] transition-transform hover:-translate-y-0.5" href="#opportunities">Browse opportunities <HomeIcon name="arrow" className="size-4" /></Link><Link className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]" href="#submit-request">Submit a request</Link></div></div></div></section>
      <div className="relative -mt-8" id="opportunities"><MarketplaceBrowser categories={categories} locations={locations} opportunities={opportunities} /></div>
      <section className="container-shell pb-20 sm:pb-28" id="submit-request"><div className="flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-[var(--surface)] p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="eyebrow">Looking for something specific?</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Submit a request and let the network help.</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Share your need with the TradeConnect team for a more focused match.</p></div><Link className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[var(--navy)] px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" href="/solutions">Start with a solution <HomeIcon name="arrow" className="size-4" /></Link></div></section>
    </div>
  );
}
