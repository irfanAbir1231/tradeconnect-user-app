import { CompanyAdminTable } from "@/src/components/admin/CompanyAdminTable";
import { adminCompanies } from "@/src/data/adminCompanies";

export default function AdminCompaniesPage() {
  return <CompanyAdminTable records={adminCompanies} />;
}
