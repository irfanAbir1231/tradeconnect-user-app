import Link from "next/link";
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { HomeIcon } from "@/src/components/home/HomeIcon";
import { businessRequests } from "@/src/data/requests";
import type { RequestStatus, RequestType } from "@/src/types";

type RequestDetailProps = { params: Promise<{ id: string }> };

const typeLabels: Record<RequestType, string> = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" };
const statusLabels: Record<RequestStatus, string> = { draft: "Draft", submitted: "Submitted", under_review: "Under Review", needs_information: "Needs Information", matching: "Matching", quotation_received: "Quotation Received", approved: "Approved", completed: "Completed", rejected: "Rejected", cancelled: "Cancelled" };

function statusClass(status: RequestStatus) {
  if (status === "submitted" || status === "matching" || status === "approved") return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (status === "under_review" || status === "needs_information" || status === "quotation_received") return "bg-[#fff4db] text-[#9b6b28]";
  return "bg-[var(--surface)] text-[var(--muted)]";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatDocumentStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function generateStaticParams() {
  return businessRequests.map((request) => ({ id: request.id }));
}

export async function generateMetadata({ params }: RequestDetailProps) {
  const { id } = await params;
  const request = businessRequests.find((item) => item.id === id);
  return { title: request ? `${request.title} · Request` : "Request not found" };
}

export default async function DashboardRequestDetailPage({ params }: RequestDetailProps) {
  const { id } = await params;
  const request = businessRequests.find((item) => item.id === id);
  if (!request) notFound();
  const latestNote = request.adminNotes[request.adminNotes.length - 1];

  return <div className="space-y-6"><DashboardHeader eyebrow="Request tracking" title={request.title} description={`${request.company.name} · Submitted ${formatDate(request.createdAt)}`} action={<Link className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)]" href="/dashboard/requests"><HomeIcon name="arrow" className="size-4 rotate-180" />Back to requests</Link>} />
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(request.status)}`}>{statusLabels[request.status]}</span><h2 className="mt-5 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Request status timeline</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Follow the progress of your request as the TradeConnect team reviews and matches it.</p></div><div className="rounded-xl bg-[var(--surface)] px-4 py-3 text-sm"><p className="text-xs text-[var(--muted)]">Last updated</p><p className="mt-1 font-semibold text-[var(--navy)]">{formatDate(request.updatedAt)}</p></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{request.statusHistory.map((event, index) => <div className={`relative rounded-xl border p-4 ${event.status === request.status ? "border-[#ecd39c] bg-[#fffaf0]" : "border-[var(--accent)] bg-[var(--accent-soft)]/40"}`} key={event.id}><div className="flex items-center gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${event.status === request.status ? "bg-[#f8eac4] text-[#9b6b28]" : "bg-[var(--accent-deep)] text-white"}`}>{event.status === request.status ? String(index + 1).padStart(2, "0") : <HomeIcon name="check" className="size-4" />}</span><div><p className="text-sm font-semibold text-[var(--navy)]">{statusLabels[event.status]}</p><p className="mt-1 text-xs text-[var(--muted)]">{formatDate(event.createdAt)} · {event.status === request.status ? "Current stage" : "Completed"}</p></div></div>{event.note ? <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{event.note}</p> : null}</div>)}</div></section>

    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Request information</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">The brief you submitted</h2><dl className="mt-6 grid gap-5 sm:grid-cols-2">{[["Request type", typeLabels[request.type]], ["Reference", request.referenceNumber], ["Category", request.category], ["Location", request.location ?? request.company.location], ["Quantity / requirement", request.quantity], ["Budget", request.budgetRange], ["Timeline", request.timeline], ["Priority", request.priority]].map(([label, value]) => <div key={label}><dt className="text-xs text-[var(--muted)]">{label}</dt><dd className="mt-1 text-sm font-semibold capitalize text-[var(--navy)]">{value}</dd></div>)}</dl><div className="mt-7 border-t border-[var(--line)] pt-6"><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Description</p><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{request.description}</p></div></section><section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Admin notes</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Your trade desk update</h2><div className="mt-6 rounded-xl bg-[var(--surface)] p-4"><span className="flex size-9 items-center justify-center rounded-lg bg-white text-[var(--accent-deep)]"><HomeIcon name="shield" className="size-4" /></span><p className="mt-4 text-sm leading-6 text-[var(--navy)]">{latestNote?.message ?? "Your request is queued for review. A TradeConnect team member will update this space when there is progress."}</p>{latestNote ? <p className="mt-3 text-xs text-[var(--muted)]">{latestNote.authorName} · {formatDate(latestNote.createdAt)}</p> : null}</div><p className="mt-4 text-xs leading-5 text-[var(--muted)]">Notes are mock placeholders for future admin communication and request updates.</p><div className="mt-6 flex flex-col gap-3"><button className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] px-4 py-3 text-sm font-semibold text-[var(--muted)]" disabled type="button">Update request</button><Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href="/dashboard/inquiries">Contact support <HomeIcon name="arrow" className="size-4" /></Link></div></section></div>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Uploaded documents</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Documents attached to this request</h2></div><span className="text-xs text-[var(--muted)]">{request.documents.length} files</span></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{request.documents.length > 0 ? request.documents.map((document) => <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-4" key={document.id}><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--accent-deep)]"><HomeIcon name="package" className="size-4" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--navy)]">{document.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{formatDocumentStatus(document.status)}{document.uploadedAt ? ` · ${formatDate(document.uploadedAt)}` : ""}</p></div></div>) : <p className="text-sm text-[var(--muted)]">No documents have been attached yet.</p>}</div></section>
  </div>;
}
