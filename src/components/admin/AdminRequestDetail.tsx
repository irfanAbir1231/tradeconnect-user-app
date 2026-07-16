"use client";

import { useState } from "react";

import { AdminNotesPanel } from "@/src/components/admin/AdminNotesPanel";
import { AssignmentPanel } from "@/src/components/admin/AssignmentPanel";
import { RequestActionsPanel } from "@/src/components/admin/RequestActionsPanel";
import { RequestDocumentsPanel } from "@/src/components/admin/RequestDocumentsPanel";
import { RequestOverview } from "@/src/components/admin/RequestOverview";
import { RequestStatusTimeline } from "@/src/components/admin/RequestStatusTimeline";
import type { AssignedTeamMember, BusinessRequest, RequestPriority, RequestStatus } from "@/src/types";

type AdminRequestDetailProps = { request: BusinessRequest; teamMembers: AssignedTeamMember[] };

export function AdminRequestDetail({ request: initialRequest, teamMembers }: AdminRequestDetailProps) {
  const [request, setRequest] = useState<BusinessRequest>(() => ({ ...initialRequest, documents: [...initialRequest.documents], adminNotes: [...initialRequest.adminNotes], statusHistory: [...initialRequest.statusHistory] }));
  const today = "2026-07-17";
  const updateStatus = (status: RequestStatus, note?: string) => setRequest((current) => ({ ...current, status, updatedAt: today, statusHistory: [...current.statusHistory, { id: `history-${Date.now()}`, status, note, updatedBy: "Sadia Ahmed", createdAt: today }] }));
  const updatePriority = (priority: RequestPriority) => setRequest((current) => ({ ...current, priority, updatedAt: today }));
  const updateAssignment = (assignedTeamMember: AssignedTeamMember | null) => setRequest((current) => ({ ...current, assignedTeamMember, updatedAt: today }));
  const addNote = (message: string) => setRequest((current) => ({ ...current, updatedAt: today, adminNotes: [...current.adminNotes, { id: `note-${Date.now()}`, message, authorName: "Sadia Ahmed", createdAt: today, isInternal: true }] }));
  const approveMarketplace = () => setRequest((current) => ({ ...current, isPublic: true, marketplaceStatus: "published", updatedAt: today }));

  return <div className="space-y-6"><RequestOverview request={request} /><RequestStatusTimeline currentStatus={request.status} history={request.statusHistory} /><div className="grid items-start gap-6 xl:grid-cols-[1.1fr_.9fr]"><div className="space-y-6"><AdminNotesPanel notes={request.adminNotes} onAddNote={addNote} /><RequestDocumentsPanel documents={request.documents} /></div><div className="space-y-6"><AssignmentPanel assignedTeamMember={request.assignedTeamMember} onAssignmentChange={updateAssignment} teamMembers={teamMembers} /><RequestActionsPanel isPublic={request.isPublic} onApproveMarketplace={approveMarketplace} onPriorityChange={updatePriority} onStatusChange={updateStatus} priority={request.priority} status={request.status} /></div></div></div>;
}

