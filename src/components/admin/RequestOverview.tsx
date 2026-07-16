import Link from "next/link";

import { PriorityBadge } from "@/src/components/admin/PriorityBadge";
import { RequestStatusBadge } from "@/src/components/admin/RequestStatusBadge";
import { HomeIcon } from "@/src/components/home/HomeIcon";
import type { BusinessRequest, RequestType } from "@/src/types";

type RequestOverviewProps = { request: BusinessRequest };

const typeLabels: Record<RequestType, string> = { import: "Import request", export: "Export opportunity", supply: "Local supply", technology: "Technology support" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div><dt className="text-xs text-[var(--muted)]">{label}</dt><dd className="mt-1 text-sm font-semibold text-[var(--navy)]">{value}</dd></div>;
}

export function RequestOverview({ request }: RequestOverviewProps) {
  return <div className="space-y-6"><section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[.68rem] font-bold text-[var(--accent-deep)]">{typeLabels[request.type]}</span><RequestStatusBadge status={request.status} /><PriorityBadge priority={request.priority} /></div><h2 className="mt-5 max-w-4xl text-2xl font-semibold leading-tight tracking-[-.045em] text-[var(--navy)] sm:text-3xl">{request.title}</h2><p className="mt-3 text-sm text-[var(--muted)]">{request.referenceNumber} · Created {formatDate(request.createdAt)} · Updated {formatDate(request.updatedAt)}</p></div><Link className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[var(--line-strong)] px-4 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--surface)]" href="/admin/requests"><HomeIcon name="arrow" className="size-4 rotate-180" />Back to requests</Link></div><div className="mt-8 border-t border-[var(--line)] pt-7"><p className="eyebrow">Request description</p><p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)]">{request.description}</p></div></section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div><p className="eyebrow">Request information</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Trade and service details</h2></div><dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Detail label="Category" value={request.category} /><Detail label="Product or service" value={request.title} />{request.type === "import" || request.type === "export" ? <><Detail label="Source country" value={request.sourceCountry} /><Detail label="Destination country" value={request.destinationCountry} /></> : null}<Detail label="Location" value={request.location} /><Detail label="Quantity / requirement" value={request.quantity} /><Detail label="Budget range" value={request.budgetRange} /><Detail label="Timeline" value={request.timeline} /></dl></section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Requester and company</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Business profile</h2></div><span className={`rounded-full px-2.5 py-1 text-[.68rem] font-bold ${request.company.isVerified ? "bg-[var(--accent-soft)] text-[var(--accent-deep)]" : "bg-[#fff4db] text-[#9b6b28]"}`}>{request.company.isVerified ? "Verified company" : "Verification pending"}</span></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><div className="rounded-xl bg-[var(--surface)] p-4"><p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--muted)]">Submitted by</p><p className="mt-3 text-base font-semibold text-[var(--navy)]">{request.user.name}</p><p className="mt-1 text-sm text-[var(--muted)]">{request.user.role}</p><dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Email</dt><dd className="font-semibold text-[var(--navy)]">{request.user.email}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Phone</dt><dd className="font-semibold text-[var(--navy)]">{request.user.phone ?? "Not provided in mock profile"}</dd></div></dl></div><div className="rounded-xl bg-[var(--surface)] p-4"><p className="text-xs font-bold uppercase tracking-[.08em] text-[var(--muted)]">Company</p><p className="mt-3 text-base font-semibold text-[var(--navy)]">{request.company.name}</p><p className="mt-1 text-sm text-[var(--muted)]">{request.company.businessType}</p><p className="mt-1 text-sm text-[var(--muted)]">{request.company.location}</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-deep)]" href={`/directory/${request.company.slug}`}>View company profile <HomeIcon name="arrow" className="size-4" /></Link></div></div></section></div>;
}
