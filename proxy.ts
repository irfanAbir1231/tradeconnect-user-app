import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/admin"];
const authPages = ["/login", "/register"];

/**
 * Next 16's proxy performs only an optimistic cookie-presence redirect. Session
 * verification and permission checks happen again in server layouts and routes.
 */
export function proxy(request: Request) {
  const url = new URL(request.url);
  const hasSessionCookie = Boolean(getSessionCookie(request));
  const isProtected = protectedPrefixes.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`));

  if (isProtected && !hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${url.pathname}${url.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSessionCookie && authPages.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
