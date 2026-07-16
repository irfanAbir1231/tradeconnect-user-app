import type { Metadata } from "next";

import { SolutionDetailPage } from "@/src/components/solutions/SolutionDetailPage";
import { solutionConfigs } from "@/src/data/solutions";

export const metadata: Metadata = { title: "Supply in Bangladesh", description: solutionConfigs.supply.description };

export default function SupplySolutionPage() {
  return <SolutionDetailPage solution={solutionConfigs.supply} />;
}
