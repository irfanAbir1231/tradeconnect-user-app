# Simplified MVP Deployment Architecture

## Decision

TradeConnect uses one deployable Git branch, `main`, and one persistent Neon database branch, `main`, for the MVP. Vercel Production and any temporary Preview deployments use the same persistent database. This is an intentional short-term simplification, not an environment-isolation model.

No Vercel deployment may depend on an automatically created Neon Preview database branch. Disable Neon automatic Preview Branching (or disconnect automatic branch injection) in the Vercel/Neon integration while retaining the persistent Neon main connection.

## Canonical deployment flow

```text
prisma migrate deploy
prisma db seed
next build
```

`vercel-build` is the only deployment build command. Migrations use a direct connection and the default seed is idempotent and production-safe. It creates canonical roles, permissions, role-permission mappings, categories, countries, and Bangladesh locations. Demo records remain opt-in through `SEED_DEMO_DATA=true`.

## Environment mapping

| Environment | Runtime | Migrations and seed | Auth origin |
| --- | --- | --- | --- |
| Local development | `DATABASE_URL` (pooled) | `DIRECT_URL`, then `DATABASE_URL_UNPOOLED` | Explicit local `BETTER_AUTH_URL` is optional and loopback-only |
| Vercel Preview | Neon main `DATABASE_URL` (pooled) | Neon main `DATABASE_URL_UNPOOLED` or `DIRECT_URL` | Exact `VERCEL_URL` and `VERCEL_BRANCH_URL` when present |
| Vercel Production | Neon main `DATABASE_URL` (pooled) | Neon main `DATABASE_URL_UNPOOLED` or `DIRECT_URL` | `https://tradeconnect-user-app.vercel.app` |

The runtime client never uses a direct migration URL. Prisma migration/schema operations prefer `DIRECT_URL` and otherwise use `DATABASE_URL_UNPOOLED`; they fail with a sanitized error if neither is configured. Neither connection value is logged or exposed to browser code.

## MVP tradeoffs

Preview activity can create accounts, sessions, rate-limit rows, and other test data in the shared persistent database. Do not use Preview for destructive testing, experimental migrations, or realistic customer data. Before real production customers or destructive testing, introduce a separately governed staging database and restore environment isolation.

## Required manual Vercel/Neon configuration

The Vercel project must have these names configured in both Production and Preview, all targeting the same persistent Neon main database branch:

| Variable | Environment | Connection purpose | Target |
| --- | --- | --- | --- |
| `DATABASE_URL` | Production, Preview | pooled runtime | Neon main |
| `DATABASE_URL_UNPOOLED` or `DIRECT_URL` | Production, Preview | direct migrations and seed | Neon main |
| `BETTER_AUTH_SECRET` | Production | production session signing | Production secret |
| `BETTER_AUTH_SECRET` | Preview | Preview session signing | Preview secret when Preview remains enabled |
| `BETTER_AUTH_URL` | Production | canonical auth origin | `https://tradeconnect-user-app.vercel.app` |

Do not delete `DATABASE_URL` before the direct migration variable is confirmed. Do not paste connection values into source control, logs, or chat.

## Dependency audit follow-up

The current production-only audit reports seven unresolved advisories: six high and one moderate. The affected package names are `@prisma/dev`, `find-my-way`, `next`, `postcss`, `prisma`, `sharp`, and `valibot`. No automatic audit fix was applied because dependency upgrades require reviewed compatibility work and a separate verification pass.
