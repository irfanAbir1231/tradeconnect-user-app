type DashboardHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function DashboardHeader({ eyebrow = "Your workspace", title, description, action }: DashboardHeaderProps) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)] sm:text-4xl">{title}</h1>{description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p> : null}</div>{action ? <div className="shrink-0">{action}</div> : null}</div>;
}
