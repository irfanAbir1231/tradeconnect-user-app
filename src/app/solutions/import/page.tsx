import type { Metadata } from "next";

import { SolutionDetailPage } from "@/src/components/solutions/SolutionDetailPage";
import { solutionConfigs } from "@/src/data/solutions";

export const metadata: Metadata = { title: "Import Solutions", description: solutionConfigs.import.description };

export default function ImportSolutionPage() {
  return <SolutionDetailPage solution={solutionConfigs.import} />;
}
