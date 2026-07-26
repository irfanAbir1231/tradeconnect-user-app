import { redirect } from "next/navigation";

import { CompanyProfileEditForm } from "@/src/components/company/profile/CompanyProfileEditForm";
import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { requireAuthenticatedPage } from "@/src/server/auth/page-guard";
import { isCompanyAdministrator, isPlatformCompanyAdministrator } from "@/src/server/company/authorization";
import { getPrimaryCompanyForActor } from "@/src/server/services/company-service";
import { listBusinessCategories, listCountries } from "@/src/server/services/reference-data-service";

export const dynamic = "force-dynamic";

export default async function CompanyProfileEditPage() {
  const actor = await requireAuthenticatedPage("/dashboard/company/edit");
  const company = await getPrimaryCompanyForActor(actor);
  if (!company) redirect("/dashboard/company/onboarding");

  const canEdit = isCompanyAdministrator(actor, company.id) || isPlatformCompanyAdministrator(actor);
  if (!canEdit) redirect("/dashboard/company");

  const [categories, countries] = await Promise.all([listBusinessCategories(), listCountries()]);

  return <div className="space-y-6"><DashboardHeader eyebrow="Company workspace" title="Edit company profile" description="Update the details your company uses across the authenticated TradeConnect workspace. Changes are checked against the current saved profile." /><CompanyProfileEditForm categories={categories} company={company} countries={countries} /></div>;
}
