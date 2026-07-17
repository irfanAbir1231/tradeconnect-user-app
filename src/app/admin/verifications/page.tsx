import { VerificationQueue } from "@/src/components/admin/VerificationQueue";
import { verificationCases } from "@/src/data/adminVerification";

export default function AdminVerificationQueuePage() {
  return <VerificationQueue verificationCases={verificationCases} />;
}

