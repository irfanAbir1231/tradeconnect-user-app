import type { Metadata } from "next";

import { SolutionDetailPage } from "@/src/components/solutions/SolutionDetailPage";
import { solutionConfigs } from "@/src/data/solutions";

export const metadata: Metadata = { title: "Export Solutions", description: solutionConfigs.export.description };

export default function ExportSolutionPage() {
  return <SolutionDetailPage solution={solutionConfigs.export} />;
}
