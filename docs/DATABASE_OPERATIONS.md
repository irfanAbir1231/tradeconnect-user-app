# TradeConnect Database Operations

## MVP environment decision

TradeConnect temporarily uses one persistent Neon main branch for Vercel Production and Preview. Disable automatic Neon Preview Branching (or automatic connection injection) in the Vercel/Neon integration. Preview test data can affect the same persistent database, so it is not suitable for destructive testing or real customer activity.

`DATABASE_URL` is the pooled runtime connection. Prisma migration/schema operations use `DIRECT_URL` when present and otherwise `DATABASE_URL_UNPOOLED`, regardless of `VERCEL_ENV`. The runtime client never uses a direct URL. Connection values stay server-only and must never be printed, committed, or exposed through `NEXT_PUBLIC_*`.

## Commands

```text
npm run db:format
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:migrate:deploy
npm run db:seed
npm run db:smoke
npm run db:studio
```

`db:migrate` creates and reviews migrations for development only. `db:migrate:deploy` applies reviewed migrations. Never run `migrate dev` in a deployment, never run migrations during request handling, and do not use `db push` or `migrate reset`.

## Deployment

The only deployment build command is:

```text
prisma migrate deploy
prisma db seed
next build
```

Migrations create the schema. The default seed is idempotent and production-safe: six canonical roles, canonical permissions, role-permission mappings, categories, countries, and Bangladesh locations. It creates no users, passwords, admin accounts, demo companies, requests, marketplace records, or personal test data. Demo technology records require `SEED_DEMO_DATA=true`.

Before deployment, confirm in the Vercel and Neon dashboards that Production and Preview `DATABASE_URL` values target the persistent Neon main branch and that their direct `DATABASE_URL_UNPOOLED` or `DIRECT_URL` values target that same branch. Do not delete `DATABASE_URL` until the direct migration variable is confirmed.

## Recovery and maintenance

Use Neon backups and point-in-time recovery according to the project retention policy. For a failed migration, stop promotion, inspect the migration/database state, then use a reviewed forward fix or approved restore procedure. Expired idempotency keys and soft-deleted records require a reviewed maintenance job later; this MVP does not add background cleanup jobs.
