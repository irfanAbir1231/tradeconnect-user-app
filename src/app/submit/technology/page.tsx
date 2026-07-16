import type { Metadata } from "next";

import { RequestPage } from "@/src/components/submit/RequestPage";

export const metadata: Metadata = { title: "Submit Technology Request", description: "Describe your technology challenge and find practical TradeConnect support." };

export default function SubmitTechnologyPage() { return <RequestPage type="technology" />; }
