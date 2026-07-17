import { InquiryTable } from "@/src/components/admin/InquiryTable";
import { inquiries, inquiryTeamMembers } from "@/src/data/inquiries";

export default function AdminInquiriesPage() {
  return <InquiryTable inquiries={inquiries} teamMembers={inquiryTeamMembers} />;
}

