# Phase 3A authentication implementation

## Delivered

- Better Auth email/password handler: `/api/auth/[...all]` (Node runtime only).
- Same-origin browser auth client, responsive `/login` and `/register` forms, and logout button.
- `GET /api/v1/me`, using the standard API envelope and returning only a safe actor projection.
- Server-side session/actor helpers and permission guards for dashboard, admin, requests, marketplace, companies, and verification routes.
- Database-backed Better Auth rate limiting, UUID IDs, secure production cookies, fixed trusted origin, 12–128 character passwords, and database default-role assignment.
- Development-only `npm run auth:grant-role -- --email <email> --role <role>` tool. Admin or super-admin grants additionally require `--confirm-admin I_UNDERSTAND`; it cannot run with `NODE_ENV=production` and writes an audit record.

## Environment

```dotenv
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

`BETTER_AUTH_SECRET` must be at least 32 characters. `BETTER_AUTH_URL` must be an absolute HTTP(S) origin without a path, such as `http://localhost:3000` locally. Never expose either through `NEXT_PUBLIC_*`, source control, logs, or browser code.

## Database deployment connection

Better Auth uses the application's pooled `DATABASE_URL` at request time. Prisma migration/schema commands deliberately resolve a direct database URL in this order: `DIRECT_URL` for local development, then Vercel Neon `DATABASE_URL_UNPOOLED` for Preview/production deployment. The `vercel-build` script runs `prisma migrate deploy && prisma db seed && next build`; migrations create the schema, while the idempotent production-safe seed creates required canonical roles, permissions, and mappings before Better Auth can assign `business_user` on signup. It never uses the pooled runtime URL for migrations.

## Known deferred work

Email verification delivery, password reset, email change, OAuth, support/abuse workflows, auth e2e tests, and all business-resource API mutations remain later phases. `RoleGate` can hide UI controls but the server guard and Route Handler checks are the actual boundary.
