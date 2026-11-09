# Phase 3A authentication implementation

## Delivered

- Better Auth email/password handler: `/api/auth/[...all]` (Node runtime only).
- Same-origin browser auth client, responsive `/login` and `/register` forms, and logout button.
- `GET /api/v1/me`, using the standard API envelope and returning only a safe actor projection.
- Server-side session/actor helpers and permission guards for dashboard, admin, requests, marketplace, companies, and verification routes.
- Database-backed Better Auth rate limiting, UUID IDs, HTTPS-only deployment cookies, dynamic allowlisted origins, 12–128 character passwords, and database default-role assignment.
- Development-only `npm run auth:grant-role -- --email <email> --role <role>` tool. Admin or super-admin grants additionally require `--confirm-admin I_UNDERSTAND`; it cannot run with `NODE_ENV=production` and writes an audit record.

## Environment

```dotenv
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

`BETTER_AUTH_SECRET` must be at least 32 characters and is mandatory in every environment. `BETTER_AUTH_URL` remains useful locally as an explicit loopback origin, such as `http://localhost:3000`; it is not required to track generated Preview URLs. Never expose either through `NEXT_PUBLIC_*`, source control, logs, or browser code.

## Deployment origins

Better Auth uses its dynamic `baseURL` configuration so each accepted request resolves its own base URL only after host validation. The production origin is `https://bhuiyan-genesis.vercel.app`. The explicit allowlist contains `localhost:3000`, the current production hostname, the former exact project hostname during the domain transition, and both exact server-side Vercel hostnames when present: `VERCEL_URL` for the unique deployment URL and `VERCEL_BRANCH_URL` for the stable Git branch URL. Both are trusted deployment metadata, validated as protocol-free `*.vercel.app` hostnames, and never read from a browser request.

Local requests use HTTP; Vercel Preview and production use HTTPS with secure cookies. Better Auth derives trusted origins from the allowed hosts, validates forwarded/request hosts before use, and rejects unknown origins rather than redirecting them to production. No wildcard is used: Vercel supplies both hostnames at build and runtime, so each Preview explicitly accepts its generated deployment URL and branch URL without manually updating `BETTER_AUTH_URL`. Other Vercel projects remain rejected.

## Signup rate limiting

Public email/password signup is enabled in local development, Vercel Preview, and Production. New accounts are assigned exactly one `business_user` role by the database hook and receive a database-backed session. Their `emailVerified` value remains `false`: email verification delivery is intentionally deferred and is not required to sign in yet.

Rate limits use Better Auth's database storage. Sign-up allows five attempts per rolling window: five minutes in local development and Vercel Preview, and one hour in production. The deployment environment is determined only from `VERCEL_ENV`; `NODE_ENV=production` on Preview does not activate the production window. A rejected request reports Better Auth's `X-Retry-After` value, which the registration form turns into a visible minute countdown and uses to prevent duplicate submissions until the bucket expires.

## Authenticated frontend identity

Server Components read `getCurrentActor()` and map it through `toAuthenticatedUserView()` before passing identity into Header, mobile navigation, dashboard navigation, and account pages. The client receives only `id`, name, email, email-verification state, roles, permissions, and company-membership summaries; it never receives sessions, cookies, account tokens, password data, or raw Prisma records. Login and signup refresh server-rendered navigation after redirecting to `/dashboard`; logout calls Better Auth, refreshes the router, and redirects to `/login`.

Business dashboard fixtures remain temporary demo data. They are visibly labeled and are not presented as the signed-in user's requests, verification state, documents, or company ownership.

## Database deployment connection

Better Auth uses the application's pooled `DATABASE_URL` at request time. Prisma migration/schema commands resolve a direct database URL in this order: `DIRECT_URL`, then Vercel Neon `DATABASE_URL_UNPOOLED`, without branching on Preview/Production. The `vercel-build` script runs `prisma migrate deploy && prisma db seed && next build`; migrations create the schema, while the idempotent production-safe seed creates required canonical roles, permissions, and mappings before Better Auth can assign `business_user` on signup. It never uses the pooled runtime URL for migrations.

For the temporary MVP, Vercel Preview and Production use the same persistent Neon main branch. Preview authentication may use a separate `BETTER_AUTH_SECRET`, but Preview database activity is shared and can create accounts, sessions, and rate-limit records. Automatic Neon Preview Branching must be disabled before relying on this deployment model.

## Known deferred work

Email verification delivery, password reset, email change, OAuth, support/abuse workflows, auth e2e tests, and all business-resource API mutations remain later phases. `RoleGate` can hide UI controls but the server guard and Route Handler checks are the actual boundary.
