import { notFound } from "next/navigation";

import { VerificationDetail } from "@/src/components/admin/VerificationDetail";
import { verificationCases, verificationReviewers } from "@/src/data/adminVerification";

type VerificationDetailPageProps = { params: Promise<{ companyId: string }> };

export function generateStaticParams() {
  return verificationCases.map((item) => ({ companyId: item.company.id }));
}

export async function generateMetadata({ params }: VerificationDetailPageProps) {
  const { companyId } = await params;
  const item = verificationCases.find((verificationCase) => verificationCase.company.id === companyId);
  return item ? { title: `${item.company.name} · Verification` } : { title: "Verification case not found" };
}

export default async function AdminVerificationDetailPage({ params }: VerificationDetailPageProps) {
  const { companyId } = await params;
  const verificationCase = verificationCases.find((item) => item.company.id === companyId);
  if (!verificationCase) notFound();
  return <VerificationDetail reviewers={verificationReviewers} verificationCase={verificationCase} />;
}
