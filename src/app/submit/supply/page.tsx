import type { Metadata } from "next";

import { RequestPage } from "@/src/components/submit/RequestPage";

export const metadata: Metadata = { title: "Submit Supply Request", description: "Join the TradeConnect local supply network." };

export default function SubmitSupplyPage() { return <RequestPage type="supply" />; }
