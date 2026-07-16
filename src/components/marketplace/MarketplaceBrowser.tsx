"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { HomeIcon, type HomeIconName } from "@/src/components/home/HomeIcon";
import type { Opportunity, OpportunityStatus, OpportunityType } from "@/src/types";

type MarketplaceBrowserProps = {
  opportunities: Opportunity[];
  categories: string[];
  locations: string[];
};

const typeLabels: Record<OpportunityType, string> = { import: "Import request", export: "Export opportunity", supply: "Local supply", technology: "Technology project" };
const typeIcons: Record<OpportunityType, HomeIconName> = { import: "package", export: "globe", supply: "building", technology: "laptop" };
const statusLabels: Record<OpportunityStatus, string> = { open: "Open", under_review: "Under review", matched: "Matched", closed: "Closed" };

function statusClass(status: OpportunityStatus) {
  if (status === "open") return "bg-[#e5f7ef] text-[#15785f]";
  if (status === "under_review") return "bg-[#fff4db] text-[#9b6b28]";
  if (status === "matched") return "bg-[#e8f0fa] text-[#31658e]";
  return "bg-[var(--surface)] text-[var(--muted)]";
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-[var(--line)] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_18px_38px_-25px_rgba(8,38,63,.5)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.08em] text-[var(--accent-deep)]"><span className="flex size-8 items-center justify-center rounded-lg bg-[var(--accent-soft)]"><HomeIcon name={typeIcons[opportunity.type]} className="size-4" /></span>{typeLabels[opportunity.type]}</span><span className={`rounded-full px-2.5 py-1 text-[.65rem] font-bold ${statusClass(opportunity.status)}`}>{statusLabels[opportunity.status]}</span></div>
      <h2 className="mt-6 min-h-14 text-xl font-semibold leading-7 tracking-[-.03em] text-[var(--navy)]">{opportunity.title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{opportunity.description}</p>
      <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]"><p className="flex items-center gap-2"><HomeIcon name="chart" className="size-3.5" /><span><strong className="font-semibold text-[var(--navy)]">Category:</strong> {opportunity.category}</span></p><p className="flex items-center gap-2"><HomeIcon name="globe" className="size-3.5" /><span><strong className="font-semibold text-[var(--navy)]">Location:</strong> {opportunity.location}</span></p><p className="flex items-center gap-2"><HomeIcon name="package" className="size-3.5" /><span><strong className="font-semibold text-[var(--navy)]">Requirement:</strong> {opportunity.quantity ?? opportunity.budget ?? "Details available on request"}</span></p></div>
      <div className="mt-6 grid grid-cols-2 gap-2 border-t border-[var(--line)] pt-4"><Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href={`/marketplace/${opportunity.slug}`}>View Details <HomeIcon name="arrow" className="size-3.5" /></Link><Link className="inline-flex items-center justify-center rounded-xl border border-[var(--line-strong)] px-3 py-3 text-xs font-semibold text-[var(--navy)] transition-colors hover:border-[var(--accent-deep)] hover:text-[var(--accent-deep)]" href={`/marketplace/${opportunity.slug}#interest`}>Submit Interest</Link></div>
    </article>
  );
}

export function MarketplaceBrowser({ opportunities, categories, locations }: MarketplaceBrowserProps) {
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | "all">("all");

  const filteredOpportunities = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return opportunities.filter((opportunity) => {
      const searchable = [opportunity.title, opportunity.description, opportunity.companyName, opportunity.category, ...opportunity.tags].join(" ").toLowerCase();
      return (!search || searchable.includes(search)) && (typeFilter === "all" || opportunity.type === typeFilter) && (categoryFilter === "all" || opportunity.category === categoryFilter) && (locationFilter === "all" || opportunity.location === locationFilter) && (statusFilter === "all" || opportunity.status === statusFilter);
    });
  }, [categoryFilter, keyword, locationFilter, opportunities, statusFilter, typeFilter]);

  function resetFilters() {
    setKeyword("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setLocationFilter("all");
    setStatusFilter("all");
  }

  return (
    <section className="container-shell pb-20 sm:pb-28" aria-label="Marketplace opportunities">
      <div className="rounded-[1.5rem] border border-[var(--line)] bg-white p-4 shadow-[0_20px_48px_-35px_rgba(8,38,63,.55)] sm:p-5"><div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]"><label className="relative block lg:col-span-1"><span className="sr-only">Search opportunities</span><HomeIcon name="chart" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" /><input className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] pl-10 pr-3 text-sm text-[var(--navy)] outline-none placeholder:text-[var(--muted)]/70 focus:border-[var(--accent-deep)]" onChange={(event) => setKeyword(event.target.value)} placeholder="Search opportunities" type="search" value={keyword} /></label><label><span className="sr-only">Request type</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setTypeFilter(event.target.value as OpportunityType | "all")} value={typeFilter}><option value="all">All types</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span className="sr-only">Category</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setCategoryFilter(event.target.value)} value={categoryFilter}><option value="all">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label><span className="sr-only">Country or location</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setLocationFilter(event.target.value)} value={locationFilter}><option value="all">All locations</option>{locations.map((location) => <option key={location} value={location}>{location}</option>)}</select></label><label><span className="sr-only">Opportunity status</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setStatusFilter(event.target.value as OpportunityStatus | "all")} value={statusFilter}><option value="all">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className="h-11 rounded-xl px-3 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--navy)]" onClick={resetFilters} type="button">Reset</button></div></div>
      <div className="mt-8 flex items-center justify-between gap-4"><p className="text-sm text-[var(--muted)]">Showing <strong className="font-semibold text-[var(--navy)]">{filteredOpportunities.length}</strong> of {opportunities.length} opportunities</p><p className="hidden text-xs text-[var(--muted)] sm:block">Updated regularly by the TradeConnect team</p></div>
      {filteredOpportunities.length > 0 ? <div className="mt-5 grid gap-4 lg:grid-cols-2">{filteredOpportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-[var(--line-strong)] bg-white px-6 py-16 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--muted)]"><HomeIcon name="chart" /></span><h2 className="mt-5 text-xl font-semibold text-[var(--navy)]">No opportunities match those filters.</h2><p className="mt-2 text-sm text-[var(--muted)]">Try a broader search or reset your filters to explore the full network.</p><button className="mt-6 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white" onClick={resetFilters} type="button">Reset filters</button></div>}
    </section>
  );
}
