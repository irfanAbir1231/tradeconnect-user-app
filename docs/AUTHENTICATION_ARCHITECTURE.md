# Phase 3A authentication architecture

TradeConnect uses Better Auth for email/password identity, signed session cookies, password hashes, session records, verification records, and database-backed rate limiting. The existing `users` table remains the canonical identity table; the existing role and permission tables remain the authorization source of truth.

## Runtime flow

1. The browser calls same-origin Better Auth endpoints at `/api/auth/*` through `src/lib/auth-client.ts`.
2. Better Auth writes `AuthSession`, `AuthAccount`, `AuthVerification`, and `AuthRateLimit` records through Prisma/Neon.
3. A Better Auth `databaseHooks.user.create.after` hook grants the seeded `business_user` role once and writes an audit event.
4. Server layouts and Route Handlers call `getCurrentActor()`, which verifies the session, then reads active roles, database permissions, and active company memberships.
5. Server guards return a login redirect for no actor or `/unauthorized` for an authenticated actor lacking permission. Client `RoleGate` only shapes UI and is never an authorization boundary.

## Model ownership

| Concern | Owner |
| --- | --- |
| User profile | Existing `User` model (`fullName` maps from Better Auth `name`) |
| Credentials and sessions | Better Auth tables and server-only handler |
| Roles, permissions, company scope | Existing `Role`, `Permission`, `RolePermission`, `UserRole`, `CompanyMember` models |
| Business requests and all marketplace/admin data | Existing domain models; still mock-data UI in Phase 3A |

## Production posture

`BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are server-only. Public email/password registration is enabled in development, Preview, and Production and assigns only `business_user`. Accounts remain unverified (`emailVerified=false`) until the later email-verification delivery phase; verification is not currently required for sign-in. No OAuth, magic link, password reset, email delivery, admin-management plugin, or business APIs are part of Phase 3A.

## Vercel and proxy assumptions

The auth base URL is a configured fixed origin, not a host inferred from arbitrary forwarded headers. Better Auth receives its default single-value IP handling for rate limiting; it does not trust forwarded-IP chains without an explicitly configured trusted proxy list. Deployments must ensure the origin is reachable only through the intended Vercel proxy path before trusting additional forwarding headers.
