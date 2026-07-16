import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="container-shell flex flex-col gap-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-semibold text-[var(--navy)]">
          <span className="size-2 rounded-full bg-[var(--accent)]" />
          TradeConnect
        </div>
        <p>Built for businesses that move the world.</p>
        <Link className="font-medium transition-colors hover:text-[var(--navy)]" href="#contact">Contact our team <span aria-hidden="true">↗</span></Link>
      </div>
    </footer>
  );
}
