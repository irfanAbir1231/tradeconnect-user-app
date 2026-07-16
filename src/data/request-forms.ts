import type { HomeIconName } from "@/src/components/home/HomeIcon";

export type RequestFormType = "import" | "export" | "supply" | "technology";

export type RequestFormConfig = {
  type: RequestFormType;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: HomeIconName;
  formTitle: string;
  formDescription: string;
  audience: string;
};

export const requestFormConfigs: Record<RequestFormType, RequestFormConfig> = {
  import: {
    type: "import",
    path: "/submit/import",
    eyebrow: "Start an import request",
    title: "Tell us what you need to source.",
    description: "Give our network the product, market, and timing context needed to help you find the right international supplier.",
    icon: "package",
    formTitle: "Import request details",
    formDescription: "A clear brief helps us identify relevant suppliers faster.",
    audience: "For retailers, distributors, manufacturers, and procurement teams.",
  },
  export: {
    type: "export",
    path: "/submit/export",
    eyebrow: "Create an export opportunity",
    title: "Put your products in front of the right buyers.",
    description: "Share your export capability, product details, and target markets so serious buyers can discover a stronger starting point.",
    icon: "globe",
    formTitle: "Export opportunity details",
    formDescription: "The more context you provide, the better buyers can understand your fit.",
    audience: "For exporters, manufacturers, private-label producers, and local brands.",
  },
  supply: {
    type: "supply",
    path: "/submit/supply",
    eyebrow: "Join the local supply network",
    title: "Connect local capability with real business demand.",
    description: "Whether you want to supply or need a supplier, create a focused request for Bangladesh-connected products and services.",
    icon: "building",
    formTitle: "Supply request details",
    formDescription: "Tell us whether you are offering capacity or looking for a local partner.",
    audience: "For manufacturers, distributors, retailers, project teams, and local service providers.",
  },
  technology: {
    type: "technology",
    path: "/submit/technology",
    eyebrow: "Find technology support",
    title: "Start with the business problem, not just the software.",
    description: "Describe where your team needs more visibility, speed, or control, and we will help frame the right technology conversation.",
    icon: "laptop",
    formTitle: "Technology support details",
    formDescription: "A little context helps us connect you with a practical product or implementation partner.",
    audience: "For SMEs, retailers, distribution teams, factories, and growing operations.",
  },
};
