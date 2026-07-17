import { notFound } from "next/navigation";

import { RoleGate } from "@/src/components/auth/RoleGate";
import { AdminRequestDetail } from "@/src/components/admin/AdminRequestDetail";
import { businessRequests } from "@/src/data/requests";

type AdminRequestPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return businessRequests.map((request) => ({ id: request.id }));
}

export async function generateMetadata({ params }: AdminRequestPageProps) {
  const { id } = await params;
  const request = businessRequests.find((item) => item.id === id);
  return request ? { title: `${request.referenceNumber} · Admin request` } : { title: "Request not found" };
}

export default async function AdminRequestPage({ params }: AdminRequestPageProps) {
  const { id } = await params;
  const request = businessRequests.find((item) => item.id === id);
  if (!request) notFound();
  const teamMembers = businessRequests.flatMap((item) => item.assignedTeamMember ? [item.assignedTeamMember] : []).filter((member, index, members) => members.findIndex((candidate) => candidate.id === member.id) === index);
  return <RoleGate requiredPermission="manage_requests" fallback={<p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]">You do not have permission to manage request records.</p>}><AdminRequestDetail request={request} teamMembers={teamMembers} /></RoleGate>;
}
