"use client";

import { useState } from "react";

import type { AssignedTeamMember } from "@/src/types";

type AssignmentPanelProps = { assignedTeamMember: AssignedTeamMember | null; teamMembers: AssignedTeamMember[]; onAssignmentChange: (member: AssignedTeamMember | null) => void };

export function AssignmentPanel({ assignedTeamMember, teamMembers, onAssignmentChange }: AssignmentPanelProps) {
  const [feedback, setFeedback] = useState("");
  const handleChange = (value: string) => { const member = teamMembers.find((candidate) => candidate.id === value) ?? null; onAssignmentChange(member); setFeedback(member ? `Assigned to ${member.name}.` : "Request marked as unassigned."); window.setTimeout(() => setFeedback(""), 3000); };

  return <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6"><p className="eyebrow">Ownership</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Assignment</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Route this request to the team member responsible for the next step.</p><label className="mt-5 block text-xs font-semibold text-[var(--navy)]" htmlFor="assigned-member">Assigned team member<select className="mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3 text-sm text-[var(--navy)] outline-none focus:border-[var(--accent-deep)]" id="assigned-member" onChange={(event) => handleChange(event.target.value)} value={assignedTeamMember?.id ?? "unassigned"}><option value="unassigned">Unassigned</option>{teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}</select></label>{assignedTeamMember ? <div className="mt-4 rounded-xl bg-[var(--surface)] p-3"><p className="text-sm font-semibold text-[var(--navy)]">{assignedTeamMember.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{assignedTeamMember.role} · {assignedTeamMember.email}</p></div> : null}<p className="mt-3 min-h-5 text-xs font-semibold text-[var(--accent-deep)]" role="status">{feedback}</p></section>;
}
