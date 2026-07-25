"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/src/lib/auth-client";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  }

  return <button className={className} disabled={isSigningOut} onClick={signOut} type="button">{isSigningOut ? "Signing out…" : "Log out"}</button>;
}
