import type { Metadata } from "next";

import { RequestPage } from "@/src/components/submit/RequestPage";

export const metadata: Metadata = { title: "Submit Import Request", description: "Create a structured import request for TradeConnect supplier matching." };

export default function SubmitImportPage() { return <RequestPage type="import" />; }
