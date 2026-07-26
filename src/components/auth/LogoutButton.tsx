"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/src/lib/auth-client";

export function LogoutButton({ className = "", onSignedOut }: { className?: string; onSignedOut?: () => void }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setError(null);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError("We could not sign you out. Please try again.");
        return;
      }

      onSignedOut?.();
      router.replace("/login");
      router.refresh();
    } catch {
      setError("We could not sign you out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return <span className="inline-flex flex-col items-start"><button aria-disabled={isSigningOut} aria-label="Log out of TradeConnect" className={className} disabled={isSigningOut} onClick={signOut} type="button">{isSigningOut ? "Signing out…" : "Log out"}</button>{error ? <span aria-live="polite" className="mt-1 text-xs text-[#9e3c32]">{error}</span> : null}</span>;
}
