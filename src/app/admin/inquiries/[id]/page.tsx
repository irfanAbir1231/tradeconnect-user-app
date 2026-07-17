import { notFound } from "next/navigation";

import { InquiryDetail } from "@/src/components/admin/InquiryDetail";
import { inquiries, inquiryTeamMembers } from "@/src/data/inquiries";

type InquiryDetailPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return inquiries.map((inquiry) => ({ id: inquiry.id }));
}

export async function generateMetadata({ params }: InquiryDetailPageProps) {
  const { id } = await params;
  const inquiry = inquiries.find((item) => item.id === id);
  return inquiry ? { title: `${inquiry.referenceNumber} · Inquiry` } : { title: "Inquiry not found" };
}

export default async function AdminInquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = await params;
  const inquiry = inquiries.find((item) => item.id === id);
  if (!inquiry) notFound();
  return <InquiryDetail inquiry={inquiry} teamMembers={inquiryTeamMembers} />;
}
