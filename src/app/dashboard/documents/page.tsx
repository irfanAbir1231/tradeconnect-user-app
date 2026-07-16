import Link from "next/link";

import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { HomeIcon, type HomeIconName } from "@/src/components/home/HomeIcon";

const uploadCards: { title: string; detail: string; icon: HomeIconName; required?: boolean }[] = [
  { title: "Trade license", detail: "Current registration document for your business", icon: "shield", required: true },
  { title: "Company profile", detail: "Overview of your business, products, and services", icon: "building", required: true },
  { title: "Product catalog", detail: "Share products or services your company offers", icon: "package" },
  { title: "Certification", detail: "Quality, compliance, or industry certifications", icon: "check" },
  { title: "Tax/VAT document", detail: "Tax identification or VAT registration document", icon: "chart" },
  { title: "Other supporting document", detail: "Any additional document for your review", icon: "spark" },
];

const documentRows = [
  { name: "Company profile", type: "Company document", date: "Jul 12, 2026", status: "Uploaded", action: "View" },
  { name: "Product catalog 2026", type: "Product document", date: "Jul 10, 2026", status: "Under review", action: "View" },
  { name: "Trade license", type: "Verification document", date: "—", status: "Missing", action: "Upload" },
  { name: "Tax/VAT document", type: "Verification document", date: "—", status: "Optional", action: "Upload" },
];

function statusClass(status: string) {
  if (status === "Uploaded") return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (status === "Under review") return "bg-[#fff4db] text-[#9b6b28]";
  return "bg-[var(--surface)] text-[var(--muted)]";
}

export default function DashboardDocumentsPage() {
  return <div className="space-y-6"><DashboardHeader title="Documents" description="Keep the documents that support your company profile organized in one place." action={<Link className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href="/dashboard/verification">View verification <HomeIcon name="shield" className="size-4" /></Link>} />
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Document center</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Add supporting documents</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Upload documents when you are ready. These static cards preview where the future upload workflow will begin.</p></div><span className="rounded-full bg-[#fff4db] px-3 py-2 text-xs font-semibold text-[#9b6b28]">1 required document missing</span></div><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{uploadCards.map((card) => <article className="group rounded-xl border border-[var(--line)] p-4 transition-colors hover:border-[var(--line-strong)] hover:bg-[#fbfdfc]" key={card.title}><div className="flex items-start justify-between gap-4"><span className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent-deep)]"><HomeIcon name={card.icon} className="size-5" /></span>{card.required ? <span className="rounded-full bg-[#fff4db] px-2 py-1 text-[.65rem] font-bold text-[#9b6b28]">Required</span> : <span className="text-[.65rem] font-semibold text-[var(--muted)]">Optional</span>}</div><h3 className="mt-5 text-sm font-semibold text-[var(--navy)]">{card.title}</h3><p className="mt-2 min-h-10 text-xs leading-5 text-[var(--muted)]">{card.detail}</p><button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--line-strong)] px-3 py-2.5 text-xs font-semibold text-[var(--navy)] transition-colors hover:border-[var(--accent-deep)] hover:text-[var(--accent-deep)]" disabled type="button">Choose file <HomeIcon name="arrow" className="size-3.5" /></button></article>)}</div></section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow">Your files</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Document history</h2></div><p className="text-xs text-[var(--muted)]">Mock workspace data · Last synced Jul 15, 2026</p></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[46rem] text-left"><thead><tr className="border-b border-[var(--line)] text-xs uppercase tracking-[.08em] text-[var(--muted)]"><th className="pb-3 pr-4 font-semibold">Document name</th><th className="pb-3 pr-4 font-semibold">Type</th><th className="pb-3 pr-4 font-semibold">Uploaded date</th><th className="pb-3 pr-4 font-semibold">Status</th><th className="pb-3 font-semibold">Action</th></tr></thead><tbody>{documentRows.map((document) => <tr className="border-b border-[var(--line)] last:border-0" key={document.name}><td className="py-4 pr-4"><p className="text-sm font-semibold text-[var(--navy)]">{document.name}</p><p className="mt-1 text-xs text-[var(--muted)]">TradeConnect workspace</p></td><td className="py-4 pr-4 text-sm text-[var(--muted)]">{document.type}</td><td className="py-4 pr-4 text-sm text-[var(--muted)]">{document.date}</td><td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(document.status)}`}>{document.status}</span></td><td className="py-4"><button className="text-xs font-semibold text-[var(--accent-deep)] disabled:cursor-not-allowed disabled:text-[var(--muted)]" disabled type="button">{document.action}</button></td></tr>)}</tbody></table></div><p className="mt-5 rounded-xl bg-[var(--surface)] p-4 text-xs leading-5 text-[var(--muted)]"><span className="font-semibold text-[var(--navy)]">Privacy note:</span> Documents are shown as mock data for now. Secure storage and document review will be connected in a future workflow.</p></section>
  </div>;
}
