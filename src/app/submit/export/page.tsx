import type { Metadata } from "next";

import { RequestPage } from "@/src/components/submit/RequestPage";

export const metadata: Metadata = { title: "Submit Export Request", description: "Create an export opportunity for TradeConnect buyer discovery." };

export default function SubmitExportPage() { return <RequestPage type="export" />; }
