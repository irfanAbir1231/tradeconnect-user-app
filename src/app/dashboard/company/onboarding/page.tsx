import { redirect } from "next/navigation";

import { CompanyOnboardingForm } from "@/src/components/company/onboarding/CompanyOnboardingForm";
import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { requireAuthenticatedPage } from "@/src/server/auth/page-guard";
import { listBusinessCategories, listCountries } from "@/src/server/services/reference-data-service";

export const dynamic = "force-dynamic";

export default async function CompanyOnboardingPage() {
  const actor = await requireAuthenticatedPage("/dashboard/company/onboarding");
  if (actor.companyMemberships.length > 0) redirect("/dashboard/company");
  const [categories, countries] = await Promise.all([listBusinessCategories(), listCountries()]);

  return <div className="space-y-6"><DashboardHeader eyebrow="Company onboarding" title="Create your company profile" description="Set up the core details TradeConnect needs to understand your business. You can add documents and submit verification later." /><CompanyOnboardingForm actorEmail={actor.email} categories={categories} countries={countries} /></div>;
}
