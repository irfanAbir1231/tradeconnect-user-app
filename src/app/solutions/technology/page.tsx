import type { Metadata } from "next";

import { DemoRequestForm } from "@/src/components/forms/DemoRequestForm";
import { SolutionDetailPage } from "@/src/components/solutions/SolutionDetailPage";
import { solutionConfigs } from "@/src/data/solutions";

export const metadata: Metadata = { title: "Technology Support", description: solutionConfigs.technology.description };

export default function TechnologySolutionPage() {
  return <><SolutionDetailPage solution={solutionConfigs.technology} /><section className="container-shell py-20 sm:py-28" id="demo"><DemoRequestForm productName="Technology support" title="Request technology support" /></section></>;
}
