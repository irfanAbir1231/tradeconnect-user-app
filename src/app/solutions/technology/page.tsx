import type { Metadata } from "next";

import { SolutionDetailPage } from "@/src/components/solutions/SolutionDetailPage";
import { solutionConfigs } from "@/src/data/solutions";

export const metadata: Metadata = { title: "Technology Support", description: solutionConfigs.technology.description };

export default function TechnologySolutionPage() {
  return <SolutionDetailPage solution={solutionConfigs.technology} />;
}
