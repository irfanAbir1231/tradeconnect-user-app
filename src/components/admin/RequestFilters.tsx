import type { AssignedTeamMember, RequestPriority, RequestStatus, RequestType } from "@/src/types";

export type RequestFilterState = {
  search: string;
  type: RequestType | "all";
  status: RequestStatus | "all";
  priority: RequestPriority | "all";
  assignedTeamMember: string;
  verification: "all" | "verified" | "unverified";
  visibility: "all" | "public" | "private";
  dateRange: "all" | "7" | "30" | "90";
};

type RequestFiltersProps = {
  filters: RequestFilterState;
  teamMembers: AssignedTeamMember[];
  typeLocked?: RequestType;
  onChange: (key: keyof RequestFilterState, value: string) => void;
  onReset: () => void;
};

const typeLabels: Record<RequestType, string> = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" };
const statusLabels: Record<RequestStatus, string> = { draft: "Draft", submitted: "Submitted", under_review: "Under review", needs_information: "Needs information", matching: "Matching", quotation_received: "Quotation received", approved: "Approved", completed: "Completed", rejected: "Rejected", cancelled: "Cancelled" };
const priorityLabels: Record<RequestPriority, string> = { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" };

export function RequestFilters({ filters, teamMembers, typeLocked, onChange, onReset }: RequestFiltersProps) {
  const fieldClass = "mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none transition-colors focus:border-[var(--accent-deep)]";

  return <div className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><label className="relative min-w-0 flex-1"><span className="sr-only">Search requests</span><svg aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" fill="none" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg><input className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] pl-10 pr-3 text-sm text-[var(--navy)] outline-none placeholder:text-[var(--muted)]/70 focus:border-[var(--accent-deep)]" onChange={(event) => onChange("search", event.target.value)} placeholder="Search reference, title, company, or user" type="search" value={filters.search} /></label><button className="h-11 rounded-xl border border-[var(--line-strong)] px-4 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--navy)]" onClick={onReset} type="button">Reset filters</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Request type</span><select className={fieldClass} disabled={Boolean(typeLocked)} onChange={(event) => onChange("type", event.target.value)} value={filters.type}><option value="all">All types</option>{Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Status</span><select className={fieldClass} onChange={(event) => onChange("status", event.target.value)} value={filters.status}><option value="all">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Priority</span><select className={fieldClass} onChange={(event) => onChange("priority", event.target.value)} value={filters.priority}><option value="all">All priorities</option>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Assigned team member</span><select className={fieldClass} onChange={(event) => onChange("assignedTeamMember", event.target.value)} value={filters.assignedTeamMember}><option value="all">Everyone</option><option value="unassigned">Unassigned</option>{teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Verification status</span><select className={fieldClass} onChange={(event) => onChange("verification", event.target.value)} value={filters.verification}><option value="all">All companies</option><option value="verified">Verified companies</option><option value="unverified">Unverified companies</option></select></label><label className="block"><span className="text-xs font-semibold text-[var(--navy)]">Visibility</span><select className={fieldClass} onChange={(event) => onChange("visibility", event.target.value)} value={filters.visibility}><option value="all">Public and private</option><option value="public">Public only</option><option value="private">Private only</option></select></label><label className="block sm:col-span-2"><span className="text-xs font-semibold text-[var(--navy)]">Date range</span><select className={fieldClass} onChange={(event) => onChange("dateRange", event.target.value)} value={filters.dateRange}><option value="all">Any submission date</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label></div></div>;
}

