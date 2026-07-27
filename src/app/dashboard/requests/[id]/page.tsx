import Link from "next/link";
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { HomeIcon } from "@/src/components/home/HomeIcon";
import type { BusinessRequestStatus, BusinessRequestType } from "@/src/types/business-requests";
import { requireAuthenticatedPage } from "@/src/server/auth/page-guard";
import { AppError } from "@/src/server/errors/app-error";
import { getBusinessRequestForActor } from "@/src/server/services/business-request-service";
import { parseBusinessRequestId } from "@/src/server/validators/business-request";

type RequestDetailProps = { params: Promise<{ id: string }> };

const typeLabels: Record<BusinessRequestType, string> = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" };
const statusLabels: Record<BusinessRequestStatus, string> = { draft: "Draft", submitted: "Submitted", under_review: "Under review", needs_information: "Needs information", matching: "Matching", quotation_received: "Quotation received", approved: "Approved", completed: "Completed", rejected: "Rejected", cancelled: "Cancelled" };

function statusClass(status: BusinessRequestStatus) {
  if (["submitted", "matching", "approved"].includes(status)) return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (["under_review", "needs_information", "quotation_received"].includes(status)) return "bg-[#fff4db] text-[#9b6b28]";
  return "bg-[var(--surface)] text-[var(--muted)]";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function valueOrFallback(value: string | null, fallback = "Not provided") {
  return value ?? fallback;
}

export default async function DashboardRequestDetailPage({ params }: RequestDetailProps) {
  const actor = await requireAuthenticatedPage("/dashboard/requests");
  const { id } = await params;
  let request;
  try {
    request = await getBusinessRequestForActor(actor, parseBusinessRequestId(id));
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    throw error;
  }

  const details = [
    ["Request type", typeLabels[request.requestType]], ["Reference", request.referenceNumber], ["Category", request.category?.name ?? "Not selected"],
    ["Source country", request.sourceCountry?.name ?? "Not applicable"], ["Destination country", request.destinationCountry?.name ?? "Not applicable"], ["Location", request.location?.name ?? "Not applicable"],
    ["Quantity", request.quantityValue ? `${request.quantityValue} ${request.quantityUnit ?? ""}`.trim() : "Not provided"], ["Budget", request.budgetMin || request.budgetMax ? `${request.budgetMin ?? ""}${request.budgetMin && request.budgetMax ? " – " : ""}${request.budgetMax ?? ""} ${request.budgetCurrencyCode ?? ""}`.trim() : "Not provided"],
    ["Timeline", valueOrFallback(request.timeline)], ["Priority", request.priority],
  ];

  return <div className="space-y-6"><DashboardHeader eyebrow="Request tracking" title={request.title} description={`${request.company.displayName} · Created ${formatDate(request.createdAt)}`} action={<Link className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)]" href="/dashboard/requests"><HomeIcon name="arrow" className="size-4 rotate-180" />Back to requests</Link>} />
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(request.status)}`}>{statusLabels[request.status]}</span><h2 className="mt-5 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Request status</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Your request is safely associated with {request.company.displayName}. Status updates will appear here as the workflow expands.</p></div><div className="rounded-xl bg-[var(--surface)] px-4 py-3 text-sm"><p className="text-xs text-[var(--muted)]">Last updated</p><p className="mt-1 font-semibold text-[var(--navy)]">{formatDate(request.updatedAt)}</p></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{request.statusHistory.map((event, index) => <div className={`rounded-xl border p-4 ${event.toStatus === request.status ? "border-[#ecd39c] bg-[#fffaf0]" : "border-[var(--accent)] bg-[var(--accent-soft)]/40"}`} key={event.id}><div className="flex items-center gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${event.toStatus === request.status ? "bg-[#f8eac4] text-[#9b6b28]" : "bg-[var(--accent-deep)] text-white"}`}>{event.toStatus === request.status ? String(index + 1).padStart(2, "0") : <HomeIcon name="check" className="size-4" />}</span><div><p className="text-sm font-semibold text-[var(--navy)]">{statusLabels[event.toStatus]}</p><p className="mt-1 text-xs text-[var(--muted)]">{formatDate(event.createdAt)}{event.toStatus === request.status ? " · Current stage" : ""}</p></div></div></div>)}</div></section>
    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Request information</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">The brief you submitted</h2><dl className="mt-6 grid gap-5 sm:grid-cols-2">{details.map(([label, value]) => <div key={label}><dt className="text-xs text-[var(--muted)]">{label}</dt><dd className="mt-1 text-sm font-semibold capitalize text-[var(--navy)]">{value}</dd></div>)}</dl><div className="mt-7 border-t border-[var(--line)] pt-6"><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Description</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{request.description}</p></div></section><section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Draft controls</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Request workflow</h2><p className="mt-4 text-sm leading-6 text-[var(--muted)]">{request.canEdit ? "This draft is still editable by its creator through the authenticated request API. The full in-dashboard editing experience is scheduled for Phase 4B.2." : "Submitted requests are retained for review and cannot be edited or deleted by the requester."}</p><div className="mt-6 rounded-xl bg-[var(--surface)] p-4"><p className="text-sm font-semibold text-[var(--navy)]">Privacy by default</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Internal notes, contact information, and documents are not included in this request view.</p></div></section></div>
  </div>;
}
