"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { HomeIcon, type HomeIconName } from "@/src/components/home/HomeIcon";
import { businessRequestStatuses, businessRequestTypes, type BusinessRequestListItem, type BusinessRequestStatus, type BusinessRequestType } from "@/src/types/business-requests";

type ApiListResponse = {
  data: BusinessRequestListItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number; hasNext: boolean; hasPrevious: boolean };
};

const typeLabels: Record<BusinessRequestType, string> = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" };
const typeIcons: Record<BusinessRequestType, HomeIconName> = { import: "package", export: "globe", supply: "building", technology: "laptop" };
const statusLabels: Record<BusinessRequestStatus, string> = { draft: "Draft", submitted: "Submitted", under_review: "Under review", needs_information: "Needs information", matching: "Matching", quotation_received: "Quotation received", approved: "Approved", completed: "Completed", rejected: "Rejected", cancelled: "Cancelled" };

function statusClass(status: BusinessRequestStatus) {
  if (["submitted", "matching", "approved"].includes(status)) return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (["under_review", "needs_information", "quotation_received"].includes(status)) return "bg-[#fff4db] text-[#9b6b28]";
  return "bg-[var(--surface)] text-[var(--muted)]";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function DashboardRequestsPage() {
  const [typeFilter, setTypeFilter] = useState<BusinessRequestType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<BusinessRequestStatus | "all">("all");
  const [response, setResponse] = useState<ApiListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loading = response === null && error === null;

  useEffect(() => {
    const controller = new AbortController();
    const search = new URLSearchParams({ page: "1", page_size: "100" });
    if (typeFilter !== "all") search.set("type", typeFilter);
    if (statusFilter !== "all") search.set("status", statusFilter);
    void fetch(`/api/v1/business-requests?${search.toString()}`, { signal: controller.signal, cache: "no-store" })
      .then(async (result) => {
        const body = await result.json() as ApiListResponse | { error?: { message?: string } };
        if (!result.ok || !("data" in body)) throw new Error("error" in body ? body.error?.message ?? "Unable to load requests." : "Unable to load requests.");
        setResponse(body);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Unable to load requests.");
      });

    return () => controller.abort();
  }, [statusFilter, typeFilter]);

  const requests = response?.data ?? [];
  const stats = {
    total: response?.meta.total ?? 0,
    attention: requests.filter((request) => request.status === "needs_information").length,
    active: requests.filter((request) => request.status === "matching").length,
  };

  const resetAndSetType = (value: BusinessRequestType | "all") => {
    setResponse(null);
    setError(null);
    setTypeFilter(value);
  };
  const resetAndSetStatus = (value: BusinessRequestStatus | "all") => {
    setResponse(null);
    setError(null);
    setStatusFilter(value);
  };

  return <div className="space-y-6"><DashboardHeader title="My requests" description="Track your company requests and follow each opportunity through to review." action={<Link className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href="/submit">Create a request <HomeIcon name="arrow" className="size-4" /></Link>} />
    <section className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Company requests</p><p className="mt-3 text-2xl font-semibold text-[var(--navy)]">{stats.total}</p><p className="mt-1 text-xs text-[var(--muted)]">In your selected company</p></div><div className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Needs attention</p><p className="mt-3 text-2xl font-semibold text-[#9b6b28]">{stats.attention}</p><p className="mt-1 text-xs text-[var(--muted)]">Requests awaiting more information</p></div><div className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Active matching</p><p className="mt-3 text-2xl font-semibold text-[var(--accent-deep)]">{stats.active}</p><p className="mt-1 text-xs text-[var(--muted)]">Partner discovery in progress</p></div></section>
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="eyebrow">Request history</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Your company requests</h2><p className="mt-2 text-sm text-[var(--muted)]">Only requests associated with your selected primary company are shown.</p></div><span className="rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">{response?.meta.total ?? 0} total</span></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2"><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Request type</span><select className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)]" onChange={(event) => resetAndSetType(event.target.value as BusinessRequestType | "all")} value={typeFilter}><option value="all">All types</option>{businessRequestTypes.map((type) => <option key={type} value={type}>{typeLabels[type]}</option>)}</select></label><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Status</span><select className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)]" onChange={(event) => resetAndSetStatus(event.target.value as BusinessRequestStatus | "all")} value={statusFilter}><option value="all">All statuses</option>{businessRequestStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label></div>
      {loading ? <div className="mt-7 grid gap-3" aria-busy="true"><div className="h-20 animate-pulse rounded-xl bg-[var(--surface)]" /><div className="h-20 animate-pulse rounded-xl bg-[var(--surface)]" /></div> : null}
      {error ? <div className="mt-7 rounded-xl border border-[#ecd39c] bg-[#fffaf0] p-5" role="alert"><p className="text-sm font-semibold text-[var(--navy)]">We could not load your requests.</p><p className="mt-1 text-sm text-[var(--muted)]">{error}</p></div> : null}
      {!loading && !error ? <><div className="mt-7 hidden overflow-x-auto md:block"><table className="w-full min-w-[52rem] text-left"><thead><tr className="border-b border-[var(--line)] text-xs uppercase tracking-[.08em] text-[var(--muted)]"><th className="pb-3 pr-5 font-semibold">Request</th><th className="pb-3 pr-5 font-semibold">Type</th><th className="pb-3 pr-5 font-semibold">Status</th><th className="pb-3 pr-5 font-semibold">Updated</th><th className="pb-3 pr-5 font-semibold">Action</th></tr></thead><tbody>{requests.map((request) => <tr className="border-b border-[var(--line)] last:border-0" key={request.id}><td className="max-w-[22rem] py-4 pr-5"><Link className="text-sm font-semibold leading-5 text-[var(--navy)] hover:text-[var(--accent-deep)]" href={`/dashboard/requests/${request.id}`}>{request.title}</Link><p className="mt-1 text-xs text-[var(--muted)]">{request.referenceNumber}</p></td><td className="py-4 pr-5"><span className="inline-flex items-center gap-2 text-sm text-[var(--muted)]"><HomeIcon name={typeIcons[request.requestType]} className="size-4 text-[var(--accent-deep)]" />{typeLabels[request.requestType]}</span></td><td className="py-4 pr-5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(request.status)}`}>{statusLabels[request.status]}</span></td><td className="whitespace-nowrap py-4 pr-5 text-sm text-[var(--muted)]">{formatDate(request.updatedAt)}</td><td className="py-4"><Link className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-deep)]" href={`/dashboard/requests/${request.id}`}>View details <HomeIcon name="arrow" className="size-3.5" /></Link></td></tr>)}</tbody></table></div><div className="mt-7 space-y-3 md:hidden">{requests.map((request) => <article className="rounded-xl border border-[var(--line)] p-4" key={request.id}><div className="flex items-start justify-between gap-4"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.08em] text-[var(--accent-deep)]"><HomeIcon name={typeIcons[request.requestType]} className="size-4" />{typeLabels[request.requestType]}</span><span className={`rounded-full px-2.5 py-1 text-[.65rem] font-semibold ${statusClass(request.status)}`}>{statusLabels[request.status]}</span></div><h3 className="mt-4 text-sm font-semibold leading-5 text-[var(--navy)]">{request.title}</h3><p className="mt-1 text-xs text-[var(--muted)]">{request.referenceNumber}</p><p className="mt-4 text-xs text-[var(--muted)]">Updated {formatDate(request.updatedAt)}</p><Link className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-deep)]" href={`/dashboard/requests/${request.id}`}>View details <HomeIcon name="arrow" className="size-3.5" /></Link></article>)}</div>{requests.length === 0 ? <div className="mt-7 rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-6 py-12 text-center"><p className="text-sm font-semibold text-[var(--navy)]">No requests yet.</p><p className="mt-2 text-xs text-[var(--muted)]">Create a request to start a new trade or technology conversation.</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-deep)]" href="/submit">Create a request <HomeIcon name="arrow" className="size-4" /></Link></div> : null}</> : null}
    </section>
  </div>;
}
