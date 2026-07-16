export const dashboardUser = {
  name: "Ahsan Rahman",
  role: "Procurement Manager",
  companyName: "Bengal Homeware Retail Group",
  companyType: "Buyer & retail distributor",
  location: "Dhaka, Bangladesh",
  initials: "AR",
  profileCompletion: 72,
  verificationStatus: "Under review",
} as const;

export const dashboardInquiries = [
  { id: "inq-001", company: "Riverstone Leather Exports Ltd.", subject: "Retail packaging partnership", status: "Awaiting response", received: "Today" },
  { id: "inq-002", company: "Delta Packaging & Industrial Supplies Ltd.", subject: "Fastener supply specification", status: "New", received: "Yesterday" },
  { id: "inq-003", company: "NextWave Digital Systems", subject: "ERP rollout discovery call", status: "In progress", received: "Jul 14" },
] as const;

export const dashboardDocuments = [
  { name: "Trade license", status: "Missing", detail: "Upload a current copy to complete verification" },
  { name: "Company profile", status: "Complete", detail: "Last updated 2 days ago" },
  { name: "Tax identification document", status: "Optional", detail: "Adding this can strengthen your profile" },
] as const;
