"use client";

import { useMemo, useState } from "react";

import { AnalyticsChart, type AnalyticsDatum } from "@/src/components/admin/AnalyticsChart";
import { MetricCard } from "@/src/components/admin/MetricCard";
import { adminCompanies } from "@/src/data/adminCompanies";
import { inquiries } from "@/src/data/inquiries";
import { marketplaceModerationListings } from "@/src/data/adminMarketplace";
import { businessRequests } from "@/src/data/requests";
import type { RequestStatus, RequestType } from "@/src/types";

type Range = "all" | "7" | "30" | "90";

const requestTypeLabels: Record<RequestType, string> = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" };
const requestStatusLabels: Record<RequestStatus, string> = { draft: "Draft", submitted: "Submitted", under_review: "Under review", needs_information: "Needs information", matching: "Matching", quotation_received: "Quotation received", approved: "Approved", completed: "Completed", rejected: "Rejected", cancelled: "Cancelled" };
const panelClass = "rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7";

function dateValue(value: string) { return new Date(`${value}T00:00:00`).getTime(); }
function formatPercent(value: number) { return `${value}%`; }
function countBy<T>(items: T[], key: (item: T) => string): AnalyticsDatum[] { const counts = new Map<string, number>(); items.forEach((item) => counts.set(key(item), (counts.get(key(item)) ?? 0) + 1)); return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value); }
function shortDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`)); }

function BarList({ title, description, data, color = "bg-[var(--accent-deep)]" }: { title: string; description: string; data: AnalyticsDatum[]; color?: string }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return <section className={panelClass}><h2 className="text-lg font-semibold tracking-[-.03em] text-[var(--navy)]">{title}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p><div className="mt-6 space-y-4">{data.length ? data.map((item) => <div key={item.label}><div className="flex items-center justify-between gap-3 text-xs"><span className="truncate font-semibold text-[var(--navy)]">{item.label}</span><span className="font-bold text-[var(--muted)]">{item.value}</span></div><div aria-hidden="true" className="mt-2 h-2 rounded-full bg-[var(--surface)]"><div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }} /></div></div>) : <p className="text-sm text-[var(--muted)]">No data in this date range.</p>}</div><ul className="sr-only">{data.map((item) => <li key={item.label}>{item.label}: {item.value}</li>)}</ul></section>;
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<Range>("all");
  const rangeLabel = range === "all" ? "All mock data" : `Last ${range} days`;
  const cutoff = range === "all" ? null : dateValue("2026-07-17") - Number(range) * 86400000;
  const filteredRequests = useMemo(() => businessRequests.filter((item) => cutoff === null || dateValue(item.createdAt) >= cutoff), [cutoff]);
  const filteredInquiries = useMemo(() => inquiries.filter((item) => cutoff === null || dateValue(item.receivedAt) >= cutoff), [cutoff]);
  const filteredListings = useMemo(() => marketplaceModerationListings.filter((item) => cutoff === null || dateValue(item.submittedAt) >= cutoff), [cutoff]);
  const completedRequests = filteredRequests.filter((item) => item.status === "completed").length;
  const verifiedCompanies = adminCompanies.filter((item) => item.verificationStatus === "approved").length;
  const convertedInquiries = filteredInquiries.filter((item) => item.status === "converted").length;
  const techLeads = filteredInquiries.filter((item) => item.source === "product_demo").length;
  const requestsByType = (Object.keys(requestTypeLabels) as RequestType[]).map((type) => ({ label: requestTypeLabels[type], value: filteredRequests.filter((item) => item.type === type).length }));
  const requestsByStatus = countBy(filteredRequests, (item) => requestStatusLabels[item.status]);
  const monthBuckets = ["May", "Jun", "Jul"].map((label) => ({ label, value: filteredRequests.filter((item) => new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(`${item.createdAt}T00:00:00`)) === label).length }));
  const marketplaceCategories = countBy(filteredListings, (item) => item.request.category).slice(0, 5);
  const companyTypes = countBy(adminCompanies, (item) => item.company.businessType);
  const verificationBreakdown = [{ label: "Verified", value: verifiedCompanies }, { label: "Unverified / pending", value: adminCompanies.length - verifiedCompanies }];
  const locations = countBy(adminCompanies, (item) => item.company.location.split(",")[0]).slice(0, 5);
  const averageReviewTime = filteredRequests.reduce((total, request) => { const last = request.statusHistory[request.statusHistory.length - 1]; return total + (last ? Math.max(0, dateValue(last.createdAt) - dateValue(request.createdAt)) / 86400000 : 0); }, 0) / Math.max(filteredRequests.filter((item) => item.statusHistory.length > 1).length, 1);
  const operations = [{ label: "Average mock review time", value: `${averageReviewTime.toFixed(1)} days`, detail: "From submission to latest status" }, { label: "Unassigned requests", value: filteredRequests.filter((item) => !item.assignedTeamMember).length, detail: "Need an operations owner" }, { label: "High-priority requests", value: filteredRequests.filter((item) => item.priority === "high" || item.priority === "urgent").length, detail: "High or urgent priority" }, { label: "Pending verification", value: adminCompanies.filter((item) => item.verificationStatus === "pending_review" || item.verificationStatus === "needs_information").length, detail: "Company cases needing review" }];
  const recentRequests = [...filteredRequests].sort((a, b) => dateValue(b.updatedAt) - dateValue(a.updatedAt)).slice(0, 5);
  const requestCompletionRate = filteredRequests.length ? Math.round((completedRequests / filteredRequests.length) * 100) : 0;

  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-sm font-semibold text-[var(--accent-deep)]">Performance intelligence</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)]">Analytics overview</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">A frontend-only snapshot of TradeConnect activity, network health, and marketplace performance.</p></div><label className="block w-full lg:w-52"><span className="text-xs font-semibold text-[var(--navy)]">Date range</span><select aria-label="Select analytics date range" className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setRange(event.target.value as Range)} value={range}><option value="all">All mock data</option><option value="90">Last 90 days</option><option value="30">Last 30 days</option><option value="7">Last 7 days</option></select></label></div>
    <p className="text-xs text-[var(--muted)]">Showing {rangeLabel}. Metrics are calculated from the current mock records and are not connected to production data.</p>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total requests" value={filteredRequests.length} detail={`${rangeLabel} submitted requests`} /><MetricCard accent="blue" label="Completed requests" value={completedRequests} detail="Requests with a completed outcome" /><MetricCard accent="purple" label="Completion rate" value={formatPercent(requestCompletionRate)} detail="Completed requests as a share of total" /><MetricCard accent="green" label="Verified companies" value={verifiedCompanies} detail="Approved company profiles" /><MetricCard accent="blue" label="Marketplace listings" value={filteredListings.length} detail="Listings submitted in range" /><MetricCard accent="amber" label="Received inquiries" value={filteredInquiries.length} detail="All admin inquiry sources" /><MetricCard accent="purple" label="Converted inquiries" value={convertedInquiries} detail="Leads moved to converted" /><MetricCard label="Technology leads" value={techLeads} detail="Product demo inquiries" /></section>

    <div><p className="eyebrow">Request trends</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Demand and workflow movement</h2></div>
    <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><AnalyticsChart title="Requests over time" description="Created requests grouped by mock calendar month." data={monthBuckets} kind="line" valueLabel="requests" /><AnalyticsChart title="Requests by type" description="How demand is distributed across the platform." data={requestsByType} color="#0f766e" valueLabel="requests" /></section>
    <AnalyticsChart title="Requests by status" description="Current workflow stage across the selected request set." data={requestsByStatus} color="#31658e" valueLabel="requests" />

    <div><p className="eyebrow">Marketplace performance</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Visibility and demand signals</h2></div>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Published listings" value={filteredListings.filter((item) => item.publicationStatus === "published").length} detail="Currently public in mock moderation data" /><MetricCard accent="blue" label="Listing views" value={filteredListings.reduce((total, item) => total + item.views, 0)} detail="Aggregate listing view count" /><MetricCard accent="purple" label="Submitted interests" value={filteredListings.reduce((total, item) => total + item.interests, 0)} detail="Interest actions on listings" /><MetricCard accent="amber" label="Top category" value={marketplaceCategories[0]?.label ?? "—"} detail={`${marketplaceCategories[0]?.value ?? 0} listing(s) in this category`} /></section>
    <BarList title="Top marketplace categories" description="Categories with the most submitted mock listings." data={marketplaceCategories} color="bg-[#7154a4]" />

    <div><p className="eyebrow">Company metrics</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Network composition</h2></div>
    <section className="grid gap-6 xl:grid-cols-3"><BarList title="Business types" description="Company profiles by operating model." data={companyTypes} /><BarList title="Verification mix" description="Approved versus other company states." data={verificationBreakdown} color="bg-[var(--accent-deep)]" /><BarList title="Top locations" description="Primary locations represented in admin records." data={locations} color="bg-[#31658e]" /></section>

    <div><p className="eyebrow">Operations</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Team workload signals</h2></div>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{operations.map((item, index) => <MetricCard accent={index === 0 ? "blue" : index === 1 ? "amber" : index === 2 ? "purple" : "green"} detail={item.detail} key={item.label} label={item.label} value={item.value} />)}</section>

    <section className={panelClass}><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="eyebrow">Recent activity</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Recently updated requests</h2></div><span className="text-xs text-[var(--muted)]">{recentRequests.length} shown</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[42rem] text-left"><thead><tr className="border-b border-[var(--line)] text-[.66rem] uppercase tracking-[.08em] text-[var(--muted)]"><th className="pb-3 font-semibold">Request</th><th className="pb-3 font-semibold">Type</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold">Company</th><th className="pb-3 text-right font-semibold">Updated</th></tr></thead><tbody>{recentRequests.map((request) => <tr className="border-b border-[var(--line)] last:border-0" key={request.id}><td className="py-4 pr-4"><p className="text-xs font-bold text-[var(--accent-deep)]">{request.referenceNumber}</p><p className="mt-1 max-w-sm text-sm font-semibold text-[var(--navy)]">{request.title}</p></td><td className="py-4 pr-4 text-sm text-[var(--muted)]">{requestTypeLabels[request.type]}</td><td className="py-4 pr-4"><span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[.68rem] font-bold capitalize text-[var(--muted)]">{requestStatusLabels[request.status]}</span></td><td className="py-4 pr-4 text-sm text-[var(--muted)]">{request.company.name}</td><td className="py-4 text-right text-xs text-[var(--muted)]">{shortDate(request.updatedAt)}</td></tr>)}</tbody></table>{recentRequests.length === 0 ? <p className="py-8 text-sm text-[var(--muted)]">No requests in this range.</p> : null}</div></section>
  </div>;
}
