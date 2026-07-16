import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HomeIcon, type HomeIconName } from "@/src/components/home/HomeIcon";
import { InquiryForm } from "@/src/components/forms/InquiryForm";
import { opportunities } from "@/src/data/opportunities";
import { companies } from "@/src/data/companies";
import type { OpportunityStatus, OpportunityType } from "@/src/types";

type OpportunityPageProps = {
  params: Promise<{ slug: string }>;
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

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export async function generateMetadata({ params }: OpportunityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = opportunities.find((item) => item.slug === slug);

  return opportunity ? { title: opportunity.title, description: opportunity.description } : { title: "Opportunity not found" };
}

export default async function OpportunityDetailPage({ params }: OpportunityPageProps) {
  const { slug } = await params;
  const opportunity = opportunities.find((item) => item.slug === slug);

  if (!opportunity) notFound();

  const company = companies.find((item) => item.id === opportunity.companyId);
  const similarOpportunities = opportunities.filter((item) => item.slug !== opportunity.slug && (item.category === opportunity.category || item.type === opportunity.type)).slice(0, 3);

  return (
    <div className="overflow-hidden">
      <section className="relative bg-[var(--navy)]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(143,226,192,.2),transparent_28%)]" /><div className="container-shell py-16 sm:py-20"><Link className="inline-flex items-center gap-2 text-xs font-semibold text-white/55 transition-colors hover:text-[var(--accent)]" href="/marketplace"><span aria-hidden="true">←</span> Back to marketplace</Link><div className="mt-8 flex flex-wrap items-center gap-3"><span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[.08em] text-[var(--accent)]"><HomeIcon name={typeIcons[opportunity.type]} className="size-4" />{typeLabels[opportunity.type]}</span><span className={`rounded-full px-3 py-2 text-xs font-bold ${statusClass(opportunity.status)}`}>{statusLabels[opportunity.status]}</span></div><div className="mt-6 max-w-4xl"><h1 className="text-4xl font-semibold leading-[1.04] tracking-[-.06em] text-white sm:text-5xl lg:text-6xl">{opportunity.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{opportunity.description}</p></div></div></section>

      <main className="container-shell py-12 sm:py-16"><div className="grid items-start gap-10 lg:grid-cols-[1.15fr_.85fr]"><div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.1em] text-[var(--muted)]">Category</p><p className="mt-3 text-base font-semibold text-[var(--navy)]">{opportunity.category}</p></div><div className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.1em] text-[var(--muted)]">Country / location</p><p className="mt-3 text-base font-semibold text-[var(--navy)]">{opportunity.location}</p></div><div className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.1em] text-[var(--muted)]">Quantity / requirement</p><p className="mt-3 text-base font-semibold text-[var(--navy)]">{opportunity.quantity ?? "Details available on request"}</p></div><div className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.1em] text-[var(--muted)]">Budget guidance</p><p className="mt-3 text-base font-semibold text-[var(--navy)]">{opportunity.budget ?? "Open to discussion"}</p></div></div><section className="mt-12"><p className="eyebrow">Opportunity brief</p><h2 className="mt-4 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">What the business is looking for</h2><p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{opportunity.description} The right partner will be able to respond with relevant capability, realistic timing, and clear next steps.</p><div className="mt-7 flex flex-wrap gap-2">{opportunity.tags.map((tag) => <span className="rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--navy)]" key={tag}>{tag}</span>)}</div></section></div>

          <aside className="lg:sticky lg:top-28"><div className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5 shadow-[0_22px_50px_-35px_rgba(8,38,63,.55)] sm:p-6" id="interest"><p className="eyebrow">Take the next step</p><h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-.04em] text-[var(--navy)]">Interested in this opportunity?</h2><p className="mt-4 text-sm leading-6 text-[var(--muted)]">Share your interest or ask for more information. A TradeConnect team member can help guide the next conversation.</p><div className="mt-7 space-y-3"><Link className="flex items-center justify-center gap-3 rounded-xl bg-[var(--navy)] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href="#inquiry">Submit Interest <HomeIcon name="arrow" className="size-4" /></Link><Link className="flex items-center justify-center rounded-xl border border-[var(--line-strong)] px-4 py-3.5 text-sm font-semibold text-[var(--navy)] transition-colors hover:border-[var(--accent-deep)] hover:text-[var(--accent-deep)]" href="#inquiry">Request More Information</Link></div><p className="mt-5 text-center text-xs text-[var(--muted)]">No commitment required to start a conversation.</p></div>{company ? <div className="mt-4 rounded-[1.5rem] bg-[var(--surface)] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.1em] text-[var(--muted)]">Company snapshot</p><div className="mt-4 flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--accent-deep)]"><HomeIcon name="building" /></span><div><h2 className="text-base font-semibold text-[var(--navy)]">{company.name}</h2><p className="mt-1 text-xs text-[var(--muted)]">{company.location}</p></div></div><p className="mt-4 text-sm leading-6 text-[var(--muted)]">{company.description}</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--line-strong)] pt-4"><div><p className="text-[.65rem] text-[var(--muted)]">Business type</p><p className="mt-1 text-xs font-semibold capitalize text-[var(--navy)]">{company.type.replace("_", " ")}</p></div><div><p className="text-[.65rem] text-[var(--muted)]">Team size</p><p className="mt-1 text-xs font-semibold text-[var(--navy)]">{company.employeeRange}</p></div></div><div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[var(--accent-deep)]"><HomeIcon name="shield" className="size-3.5" />{company.verified ? "Verified business profile" : "Business profile"}</div></div> : null}</aside>
        </div>

        <section className="mt-20 border-t border-[var(--line)] pt-16" id="inquiry"><div className="grid items-start gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Make a connection</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-[var(--navy)]">Ready to talk about this opportunity?</h2><p className="mt-5 text-sm leading-6 text-[var(--muted)]">Use the inquiry form to request a quotation, submit interest, or ask for more information.</p></div><InquiryForm context={opportunity.title} /></div></section>
        <section className="mt-20 border-t border-[var(--line)] pt-16" id="information"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Keep exploring</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-[var(--navy)]">Similar opportunities</h2></div><Link className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-deep)]" href="/marketplace">View all opportunities <HomeIcon name="arrow" className="size-4" /></Link></div>{similarOpportunities.length > 0 ? <div className="mt-8 grid gap-4 lg:grid-cols-3">{similarOpportunities.map((similar) => <Link className="group rounded-2xl border border-[var(--line)] bg-white p-5 transition-all hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_18px_38px_-25px_rgba(8,38,63,.45)]" href={`/marketplace/${similar.slug}`} key={similar.slug}><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.08em] text-[var(--accent-deep)]">{typeLabels[similar.type]}</span><span className={`rounded-full px-2 py-1 text-[.6rem] font-bold ${statusClass(similar.status)}`}>{statusLabels[similar.status]}</span></div><h3 className="mt-5 min-h-12 text-base font-semibold leading-6 text-[var(--navy)]">{similar.title}</h3><p className="mt-4 text-xs text-[var(--muted)]">{similar.location} · {similar.category}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-deep)]">View details <HomeIcon name="arrow" className="size-3.5" /></span></Link>)}</div> : <p className="mt-8 text-sm text-[var(--muted)]">More opportunities will be added to the network soon.</p>}</section>
      </main>
    </div>
  );
}
