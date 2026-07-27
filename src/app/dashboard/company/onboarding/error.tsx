"use client";

export default function CompanyOnboardingError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="rounded-2xl border border-[#edc7c2] bg-[#fff3f1] p-6"><h1 className="text-xl font-semibold text-[var(--navy)]">Company onboarding is temporarily unavailable</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Please try loading the form again. Your company profile has not been created.</p><button className="mt-5 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white" onClick={reset} type="button">Try again</button></section>;
}
