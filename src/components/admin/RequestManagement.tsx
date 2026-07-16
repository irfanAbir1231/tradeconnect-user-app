"use client";

import { useMemo, useState } from "react";

import { RequestFilters, type RequestFilterState } from "@/src/components/admin/RequestFilters";
import { RequestTable, type RequestAction } from "@/src/components/admin/RequestTable";
import { businessRequests } from "@/src/data/requests";
import type { RequestPriority, RequestType } from "@/src/types";

type RequestManagementProps = { title: string; description: string; fixedType?: RequestType };

const priorityOrder: Record<RequestPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

export function RequestManagement({ title, description, fixedType }: RequestManagementProps) {
  const initialFilters: RequestFilterState = { search: "", type: fixedType ?? "all", status: "all", priority: "all", assignedTeamMember: "all", verification: "all", visibility: "all", dateRange: "all" };
  const [filters, setFilters] = useState<RequestFilterState>(initialFilters);
  const [sort, setSort] = useState("newest");
  const [actionMessage, setActionMessage] = useState("");

  const scopedRequests = useMemo(() => fixedType ? businessRequests.filter((request) => request.type === fixedType) : businessRequests, [fixedType]);
  const teamMembers = useMemo(() => scopedRequests.flatMap((request) => request.assignedTeamMember ? [request.assignedTeamMember] : []).filter((member, index, members) => members.findIndex((candidate) => candidate.id === member.id) === index), [scopedRequests]);
  const filteredRequests = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const days = filters.dateRange === "7" ? 7 : filters.dateRange === "30" ? 30 : filters.dateRange === "90" ? 90 : null;
    const filtered = scopedRequests.filter((request) => {
      const searchable = [request.referenceNumber, request.title, request.company.name, request.user.name, request.category].join(" ").toLowerCase();
      const age = (new Date("2026-07-17T00:00:00").getTime() - new Date(`${request.createdAt}T00:00:00`).getTime()) / 86400000;
      return (!search || searchable.includes(search)) && (filters.type === "all" || request.type === filters.type) && (filters.status === "all" || request.status === filters.status) && (filters.priority === "all" || request.priority === filters.priority) && (filters.assignedTeamMember === "all" || (filters.assignedTeamMember === "unassigned" ? !request.assignedTeamMember : request.assignedTeamMember?.id === filters.assignedTeamMember)) && (filters.verification === "all" || (filters.verification === "verified" ? request.company.isVerified : !request.company.isVerified)) && (filters.visibility === "all" || (filters.visibility === "public" ? request.isPublic : !request.isPublic)) && (days === null || age <= days);
    });
    return filtered.sort((a, b) => {
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
      if (sort === "priority") return priorityOrder[b.priority] - priorityOrder[a.priority];
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [filters, scopedRequests, sort]);

  const updateFilter = (key: keyof RequestFilterState, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const resetFilters = () => setFilters(initialFilters);
  const handleAction = (action: RequestAction, request: (typeof businessRequests)[number]) => {
    const labels: Record<RequestAction, string> = { assign: "Assignment workflow opened", status: "Status workflow opened", note: "Note composer opened", publish: request.isPublic ? "Listing is already public" : "Publish workflow opened" };
    setActionMessage(`${labels[action]} for ${request.referenceNumber}. This is a mock action for now.`);
    window.setTimeout(() => setActionMessage(""), 3500);
  };

  const summaryCards = [{ label: "Requests in view", value: scopedRequests.length, detail: fixedType ? "This request type" : "All request types" }, { label: "Awaiting review", value: scopedRequests.filter((request) => request.status === "submitted" || request.status === "under_review" || request.status === "needs_information").length, detail: "Needs team attention" }, { label: "Urgent priority", value: scopedRequests.filter((request) => request.priority === "urgent").length, detail: "Escalated requests" }, { label: "Unassigned", value: scopedRequests.filter((request) => !request.assignedTeamMember).length, detail: "Ready for assignment" }];

  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-sm font-semibold text-[var(--accent-deep)]">Request operations</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)]">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--muted)]"><span className="size-2 rounded-full bg-[var(--accent-deep)]" />Mock operations workspace</span></div>{actionMessage ? <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--accent-deep)]" role="status">{actionMessage}</div> : null}<section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{summaryCards.map((card) => <div className="rounded-2xl border border-[var(--line)] bg-white p-5" key={card.label}><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">{card.label}</p><p className="mt-4 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)]">{card.value}</p><p className="mt-1 text-xs text-[var(--muted)]">{card.detail}</p></div>)}</section><RequestFilters filters={filters} onChange={updateFilter} onReset={resetFilters} teamMembers={teamMembers} typeLocked={fixedType} /><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="text-sm text-[var(--muted)]">Showing <strong className="font-semibold text-[var(--navy)]">{filteredRequests.length}</strong> of {scopedRequests.length} requests</p><label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">Sort by<select className="h-10 rounded-xl border border-[var(--line)] bg-white px-3 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setSort(event.target.value)} value={sort}><option value="newest">Newest submitted</option><option value="oldest">Oldest submitted</option><option value="updated">Recently updated</option><option value="priority">Highest priority</option></select></label></div><RequestTable onAction={handleAction} requests={filteredRequests} /></div>;
}
