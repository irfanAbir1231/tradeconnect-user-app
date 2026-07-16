"use client";

import Link from "next/link";

import { HomeIcon } from "@/src/components/home/HomeIcon";
import { PriorityBadge } from "@/src/components/admin/PriorityBadge";
import { RequestStatusBadge } from "@/src/components/admin/RequestStatusBadge";
import type { BusinessRequest, RequestType } from "@/src/types";

export type RequestAction = "assign" | "status" | "note" | "publish";

type RequestTableProps = {
  requests: BusinessRequest[];
  onAction?: (action: RequestAction, request: BusinessRequest) => void;
};

const typeLabels: Record<RequestType, string> = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function ActionButton({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return <button className="rounded-lg border border-[var(--line)] px-2.5 py-2 text-[.68rem] font-semibold text-[var(--muted)] transition-colors hover:border-[var(--line-strong)] hover:bg-[var(--surface)] hover:text-[var(--navy)]" onClick={onClick} title={title} type="button">{children}</button>;
}

function Actions({ request, onAction }: { request: BusinessRequest; onAction?: RequestTableProps["onAction"] }) {
  return <div className="flex flex-wrap gap-2"><Link className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--navy)] px-2.5 py-2 text-[.68rem] font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href={`/admin/requests/${request.id}`}><HomeIcon name="arrow" className="size-3.5" />View</Link><ActionButton onClick={() => onAction?.("assign", request)} title="Assign team member">Assign</ActionButton><ActionButton onClick={() => onAction?.("status", request)} title="Change status">Status</ActionButton><ActionButton onClick={() => onAction?.("note", request)} title="Add admin note">Note</ActionButton><ActionButton onClick={() => onAction?.("publish", request)} title="Publish to marketplace">{request.isPublic ? "Published" : "Publish"}</ActionButton></div>;
}

export function RequestTable({ requests, onAction }: RequestTableProps) {
  if (requests.length === 0) return <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-white px-6 py-16 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--muted)]"><HomeIcon name="package" /></span><h2 className="mt-5 text-lg font-semibold text-[var(--navy)]">No requests match these filters.</h2><p className="mt-2 text-sm text-[var(--muted)]">Try a broader search or reset the filters to see more requests.</p></div>;

  return <div className="rounded-2xl border border-[var(--line)] bg-white"><div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[76rem] text-left"><thead><tr className="border-b border-[var(--line)] text-[.66rem] uppercase tracking-[.08em] text-[var(--muted)]"><th className="px-5 py-4 font-semibold">Reference</th><th className="px-5 py-4 font-semibold">Request title</th><th className="px-5 py-4 font-semibold">Type</th><th className="px-5 py-4 font-semibold">Company / user</th><th className="px-5 py-4 font-semibold">Category</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Priority</th><th className="px-5 py-4 font-semibold">Assigned to</th><th className="px-5 py-4 font-semibold">Submitted</th><th className="px-5 py-4 font-semibold">Updated</th><th className="px-5 py-4 font-semibold">Actions</th></tr></thead><tbody>{requests.map((request) => <tr className="border-b border-[var(--line)] align-top last:border-0" key={request.id}><td className="whitespace-nowrap px-5 py-4 text-xs font-bold text-[var(--accent-deep)]">{request.referenceNumber}</td><td className="max-w-[15rem] px-5 py-4"><Link className="text-sm font-semibold leading-5 text-[var(--navy)] hover:text-[var(--accent-deep)]" href={`/admin/requests/${request.id}`}>{request.title}</Link></td><td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--muted)]">{typeLabels[request.type]}</td><td className="min-w-[12rem] px-5 py-4"><p className="text-sm font-semibold text-[var(--navy)]">{request.company.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{request.user.name}</p></td><td className="max-w-[11rem] px-5 py-4 text-sm text-[var(--muted)]">{request.category}</td><td className="whitespace-nowrap px-5 py-4"><RequestStatusBadge status={request.status} /></td><td className="whitespace-nowrap px-5 py-4"><PriorityBadge priority={request.priority} /></td><td className="min-w-[9rem] px-5 py-4 text-sm text-[var(--muted)]">{request.assignedTeamMember?.name ?? "Unassigned"}</td><td className="whitespace-nowrap px-5 py-4 text-xs text-[var(--muted)]">{formatDate(request.createdAt)}</td><td className="whitespace-nowrap px-5 py-4 text-xs text-[var(--muted)]">{formatDate(request.updatedAt)}</td><td className="min-w-[16rem] px-5 py-4"><Actions onAction={onAction} request={request} /></td></tr>)}</tbody></table></div><div className="divide-y divide-[var(--line)] lg:hidden">{requests.map((request) => <article className="p-4 sm:p-5" key={request.id}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[.08em] text-[var(--accent-deep)]">{request.referenceNumber}</p><Link className="mt-2 block text-sm font-semibold leading-5 text-[var(--navy)]" href={`/admin/requests/${request.id}`}>{request.title}</Link></div><RequestStatusBadge status={request.status} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4"><div><p className="text-[var(--muted)]">Type</p><p className="mt-1 font-semibold text-[var(--navy)]">{typeLabels[request.type]}</p></div><div><p className="text-[var(--muted)]">Priority</p><div className="mt-1"><PriorityBadge priority={request.priority} /></div></div><div><p className="text-[var(--muted)]">Company</p><p className="mt-1 truncate font-semibold text-[var(--navy)]">{request.company.name}</p></div><div><p className="text-[var(--muted)]">Assigned</p><p className="mt-1 truncate font-semibold text-[var(--navy)]">{request.assignedTeamMember?.name ?? "Unassigned"}</p></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4"><p className="text-xs text-[var(--muted)]">Submitted {formatDate(request.createdAt)} · Updated {formatDate(request.updatedAt)}</p><Actions onAction={onAction} request={request} /></div></article>)}</div></div>;
}

