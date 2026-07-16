import { notFound } from "next/navigation";

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
  return <AdminRequestDetail request={request} teamMembers={teamMembers} />;
}
