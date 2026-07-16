"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { HomeIcon } from "@/src/components/home/HomeIcon";
import type { Company, CompanyType } from "@/src/types";

type DirectoryBrowserProps = {
  companies: Company[];
  categories: string[];
  locations: string[];
};

const businessTypeLabels: Record<CompanyType, string> = { supplier: "Supplier", exporter: "Exporter", buyer: "Buyer", technology_provider: "Technology provider" };

function CompanyCard({ company }: { company: Company }) {
  return <article className="group flex flex-col rounded-2xl border border-[var(--line)] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_18px_38px_-25px_rgba(8,38,63,.5)] sm:p-6"><div className="flex items-start justify-between gap-4"><span className="flex size-12 items-center justify-center rounded-xl bg-[var(--accent)] text-base font-bold text-[var(--navy)]">{company.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}</span>{company.isVerified ? <span className="flex items-center gap-1.5 rounded-full bg-[#e5f7ef] px-2.5 py-1 text-[.65rem] font-bold text-[#15785f]"><HomeIcon name="shield" className="size-3.5" />Verified</span> : <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[.65rem] font-bold text-[var(--muted)]">Unverified</span>}</div><h2 className="mt-6 text-xl font-semibold leading-6 tracking-[-.03em] text-[var(--navy)]">{company.name}</h2><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--navy)]">{company.businessType}</span><span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">{company.categories[0]}</span></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{company.description}</p><p className="mt-5 flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]"><HomeIcon name="globe" className="size-3.5" />{company.location}</p><Link className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href={`/directory/${company.slug}`}>View Profile <HomeIcon name="arrow" className="size-4" /></Link></article>;
}

export function DirectoryBrowser({ companies, categories, locations }: DirectoryBrowserProps) {
  const [keyword, setKeyword] = useState("");
  const [businessType, setBusinessType] = useState<CompanyType | "all">("all");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [verification, setVerification] = useState<"all" | "verified" | "unverified">("all");

  const filteredCompanies = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    return companies.filter((company) => {
      const searchable = [company.name, company.businessType, company.description, company.location, ...company.categories, ...company.products, ...company.services].join(" ").toLowerCase();
      return (!search || searchable.includes(search)) && (businessType === "all" || company.type === businessType) && (category === "all" || company.categories.includes(category)) && (location === "all" || company.location === location) && (verification === "all" || (verification === "verified" ? company.isVerified : !company.isVerified));
    });
  }, [businessType, category, companies, keyword, location, verification]);

  function resetFilters() {
    setKeyword("");
    setBusinessType("all");
    setCategory("all");
    setLocation("all");
    setVerification("all");
  }

  return <section className="container-shell pb-20 sm:pb-28" aria-label="Company directory"><div className="rounded-[1.5rem] border border-[var(--line)] bg-white p-4 shadow-[0_20px_48px_-35px_rgba(8,38,63,.55)] sm:p-5"><div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(4,1fr)_auto]"><label className="relative"><span className="sr-only">Search companies</span><HomeIcon name="chart" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" /><input className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] pl-10 pr-3 text-sm text-[var(--navy)] outline-none placeholder:text-[var(--muted)]/70 focus:border-[var(--accent-deep)]" onChange={(event) => setKeyword(event.target.value)} placeholder="Search companies, products, services" type="search" value={keyword} /></label><label><span className="sr-only">Business type</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setBusinessType(event.target.value as CompanyType | "all")} value={businessType}><option value="all">All business types</option>{Object.entries(businessTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span className="sr-only">Category</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setCategory(event.target.value)} value={category}><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span className="sr-only">Location</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setLocation(event.target.value)} value={location}><option value="all">All locations</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span className="sr-only">Verification status</span><select className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setVerification(event.target.value as "all" | "verified" | "unverified")} value={verification}><option value="all">All verification</option><option value="verified">Verified only</option><option value="unverified">Unverified only</option></select></label><button className="h-11 rounded-xl px-3 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--navy)]" onClick={resetFilters} type="button">Reset</button></div></div><div className="mt-8 flex items-center justify-between gap-4"><p className="text-sm text-[var(--muted)]">Showing <strong className="font-semibold text-[var(--navy)]">{filteredCompanies.length}</strong> of {companies.length} companies</p><p className="hidden text-xs text-[var(--muted)] sm:block">Profiles reviewed by the TradeConnect team</p></div>{filteredCompanies.length > 0 ? <div className="mt-5 grid gap-4 lg:grid-cols-2">{filteredCompanies.map((company) => <CompanyCard company={company} key={company.id} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-[var(--line-strong)] bg-white px-6 py-16 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--muted)]"><HomeIcon name="building" /></span><h2 className="mt-5 text-xl font-semibold text-[var(--navy)]">No companies match those filters.</h2><p className="mt-2 text-sm text-[var(--muted)]">Try a broader search or reset your filters.</p><button className="mt-6 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white" onClick={resetFilters} type="button">Reset filters</button></div>}</section>;
}
