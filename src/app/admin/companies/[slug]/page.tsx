import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RoleGate } from "@/src/components/auth/RoleGate";
import { CompanyAdminDetail } from "@/src/components/admin/CompanyAdminDetail";
import { adminCompanies } from "@/src/data/adminCompanies";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return adminCompanies.map((record) => ({ slug: record.company.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = adminCompanies.find((item) => item.company.slug === slug);
  return { title: record ? `${record.company.name} | Admin | TradeConnect` : "Company not found | Admin | TradeConnect" };
}

export default async function AdminCompanyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const record = adminCompanies.find((item) => item.company.slug === slug);
  if (!record) notFound();
  return <RoleGate requiredPermission="manage_companies" fallback={<p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]">You do not have permission to manage company records.</p>}><CompanyAdminDetail record={record} /></RoleGate>;
}
