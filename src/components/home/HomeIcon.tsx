export type HomeIconName =
  | "arrow"
  | "building"
  | "check"
  | "chart"
  | "globe"
  | "laptop"
  | "package"
  | "shield"
  | "spark"
  | "users";

type HomeIconProps = {
  name: HomeIconName;
  className?: string;
};

export function HomeIcon({ name, className = "size-5" }: HomeIconProps) {
  const commonProps = {
    "aria-hidden": true,
    className,
    fill: "none",
    viewBox: "0 0 24 24",
  } as const;

  switch (name) {
    case "arrow":
      return <svg {...commonProps}><path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
    case "building":
      return <svg {...commonProps}><path d="M4 20V6.5L12 4l8 2.5V20M8 20v-3h8v3M8 9h.01M12 9h.01M16 9h.01M8 12h.01M12 12h.01M16 12h.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
    case "check":
      return <svg {...commonProps}><path d="m5 12 4.2 4.2L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
    case "chart":
      return <svg {...commonProps}><path d="M5 19V5m0 14h15M8 15l3-4 3 2 4-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
    case "globe":
      return <svg {...commonProps}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M3.8 12h16.4M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5s-1.1 6.2-3.2 8.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5Z" stroke="currentColor" strokeWidth="1.7" /></svg>;
    case "laptop":
      return <svg {...commonProps}><rect height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="15" x="4.5" y="5" /><path d="M3 19h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>;
    case "package":
      return <svg {...commonProps}><path d="m4.5 7.5 7.5-4 7.5 4v9l-7.5 4-7.5-4v-9Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="m4.8 7.7 7.2 4 7.2-4M12 11.7v8.5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
    case "shield":
      return <svg {...commonProps}><path d="M12 3.5 19 6v5.4c0 4.3-2.8 7.6-7 9.1-4.2-1.5-7-4.8-7-9.1V6l7-2.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="m8.8 12 2.1 2.1 4.5-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
    case "spark":
      return <svg {...commonProps}><path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3ZM19 16l.5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
    case "users":
      return <svg {...commonProps}><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" /><path d="M3.5 19c.5-3.1 2.3-5 5.5-5s5 1.9 5.5 5M16 5.5a2.7 2.7 0 0 1 0 5.1M17 14c2 .5 3.2 2.1 3.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>;
  }
}
