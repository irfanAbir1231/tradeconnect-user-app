"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/src/lib/auth-client";

type AuthMode = "login" | "register";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/dashboard";
  }

  const nextUrl = new URL(value, window.location.origin);
  return nextUrl.origin === window.location.origin ? `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}` : "/dashboard";
}

function retryAfterSeconds(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 86_400 ? parsed : 0;
}

function retryMessage(seconds: number) {
  const minutes = Math.ceil(seconds / 60);
  return `Too many attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  const isRegistration = mode === "register";
  const title = isRegistration ? "Create your TradeConnect account" : "Welcome back";
  const isRateLimited = retryAfter > 0;

  useEffect(() => {
    if (!retryAfter) {
      return;
    }

    const timer = window.setInterval(() => {
      setRetryAfter((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [retryAfter]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isRateLimited) {
      return;
    }

    setError(null);

    if (isRegistration && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isRegistration && !acceptedTerms) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    setIsSubmitting(true);
    let receivedRetryAfter = 0;

    try {
      const fetchOptions = {
        onResponse: ({ response }: { response: Response }) => {
          receivedRetryAfter = retryAfterSeconds(response.headers.get("x-retry-after"));
        },
      };
      const result = isRegistration
        ? await authClient.signUp.email({ name: fullName.trim(), email: email.trim(), password, fetchOptions })
        : await authClient.signIn.email({ email: email.trim(), password, fetchOptions });

      if (result.error) {
        if (receivedRetryAfter) {
          setRetryAfter(receivedRetryAfter);
          setError(retryMessage(receivedRetryAfter));
          return;
        }

        setError(isRegistration ? "We could not create an account with those details. Try signing in or use a different email." : "We could not sign you in with those details.");
        return;
      }

      router.replace(safeNextPath(new URLSearchParams(window.location.search).get("next")));
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container-shell flex min-h-[72vh] items-center py-10 sm:py-16">
      <section className="mx-auto w-full max-w-md rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-[0_24px_70px_-45px_rgba(15,43,55,.4)] sm:p-8">
        <p className="eyebrow">TradeConnect account</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{isRegistration ? "Start with a secure account and build your company profile when you are ready." : "Sign in to manage your business requests and company workspace."}</p>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          {isRegistration ? <label className="block text-sm font-medium text-[var(--navy)]">Full name<input autoComplete="name" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:border-[var(--accent-deep)]" maxLength={160} onChange={(event) => setFullName(event.target.value)} required value={fullName} /></label> : null}
          <label className="block text-sm font-medium text-[var(--navy)]">Email address<input autoComplete="email" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label className="block text-sm font-medium text-[var(--navy)]">Password<input autoComplete={isRegistration ? "new-password" : "current-password"} className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:border-[var(--accent-deep)]" minLength={12} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          {isRegistration ? <><p className="text-xs leading-5 text-[var(--muted)]">Use at least 12 characters. Password reset and email verification will be added in a later release.</p><label className="block text-sm font-medium text-[var(--navy)]">Confirm password<input autoComplete="new-password" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:border-[var(--accent-deep)]" minLength={12} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} /></label><label className="flex items-start gap-3 text-sm leading-5 text-[var(--muted)]"><input checked={acceptedTerms} className="mt-1 size-4 accent-[var(--accent-deep)]" onChange={(event) => setAcceptedTerms(event.target.checked)} type="checkbox" />I agree to the <Link className="font-medium text-[var(--navy)] underline" href="/terms">Terms</Link> and <Link className="font-medium text-[var(--navy)] underline" href="/privacy">Privacy Policy</Link>.</label></> : null}
          {error ? <p aria-live="polite" className="rounded-xl border border-[#edc7c2] bg-[#fff3f1] px-3 py-2.5 text-sm text-[#9e3c32]">{isRateLimited ? retryMessage(retryAfter) : error}</p> : null}
          <button className="w-full rounded-xl bg-[var(--accent-deep)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--navy)] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || isRateLimited} type="submit">{isSubmitting ? "Please wait…" : isRateLimited ? retryMessage(retryAfter) : isRegistration ? "Create account" : "Sign in"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">{isRegistration ? "Already have an account?" : "New to TradeConnect?"} <Link className="font-semibold text-[var(--accent-deep)] hover:text-[var(--navy)]" href={isRegistration ? "/login" : "/register"}>{isRegistration ? "Sign in" : "Create an account"}</Link></p>
      </section>
    </main>
  );
}
