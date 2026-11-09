export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Directory", href: "/directory" },
  { label: "Technology Products", href: "/products" },
  { label: "Resources", href: "/#resources" },
  { label: "About", href: "/#about" },
];

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const footerNavGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { label: "Overview", href: "/platform" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Technology Products", href: "/products" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "For buyers", href: "/solutions/import" },
      { label: "For suppliers", href: "/solutions/supply" },
      { label: "For service providers", href: "/solutions/technology" },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { label: "Browse marketplace", href: "/marketplace" },
      { label: "Submit a request", href: "/submit" },
      { label: "Business directory", href: "/directory" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Insights", href: "/#resources" },
      { label: "Trade guides", href: "/#resources" },
      { label: "Help center", href: "/#resources" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About Bhuiyan Genesis", href: "/#about" },
      { label: "Contact", href: "/submit" },
      { label: "Careers", href: "/#about" },
    ],
  },
];
