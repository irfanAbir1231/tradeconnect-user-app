import { DashboardNav } from "@/src/components/dashboard/DashboardNav";
import { requireAuthenticatedPage } from "@/src/server/auth/page-guard";
import { toCompanyMemberProfileView, toCompanyNavigationView } from "@/src/server/company/dashboard-view";
import { toAuthenticatedUserView } from "@/src/server/auth/user-view";
import { getPrimaryCompanyForActor } from "@/src/server/services/company-service";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const actor = await requireAuthenticatedPage("/dashboard");
  const user = toAuthenticatedUserView(actor);
  const company = await getPrimaryCompanyForActor(actor);
  const membership = actor.companyMemberships.find((item) => item.isPrimary) ?? actor.companyMemberships[0];
  const navigationCompany = company && membership ? toCompanyNavigationView(toCompanyMemberProfileView(actor, company, membership)) : undefined;

  return <div className="bg-[#f5f8f7] py-6 sm:py-8"><div className="container-shell flex items-start gap-6"><DashboardNav company={navigationCompany} user={user} /><div className="min-w-0 flex-1">{children}</div></div></div>;
}
