# TradeConnect Database Operations

## Environment safety

Use separate Neon databases/branches for development, preview, staging, and production. Configure `DATABASE_URL` for pooled runtime access. Prisma CLI migration/schema operations resolve a direct connection in this order: local `DIRECT_URL`, then Vercel Neon `DATABASE_URL_UNPOOLED`. `.env.example` contains names only. Never print, commit, or expose any connection value through `NEXT_PUBLIC_*` or an API response.

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

`db:migrate` is for a development database and creates/reviews migrations. `db:migrate:deploy` applies reviewed migrations in staging/production. Never run `migrate dev` in production, never run migrations during app startup, and do not use `db push` as the production strategy.

## Development

1. Configure a disposable local/Neon development branch.
2. Set pooled `DATABASE_URL` and direct `DIRECT_URL` locally.
3. Run format, validate, generate, `db:migrate`, `db:seed`, and `db:smoke`.
4. Inspect generated SQL for foreign keys, delete behavior, enums, decimals, and indexes before committing a migration.

The initial development migration `20260721190410_init_domain` is applied and the direct branch is up to date. The pooled `DATABASE_URL` and direct `DIRECT_URL` have been verified against the same Neon development branch; the seed and smoke test passed. Keep this branch-alignment check in the release procedure, because a matching database name alone is insufficient when the endpoint branch differs.

## Preview

Use an isolated Neon branch/database per preview or controlled preview group. Vercel’s Neon integration supplies pooled `DATABASE_URL` for runtime and `DATABASE_URL_UNPOOLED` for `prisma migrate deploy`. The `vercel-build` script runs `prisma migrate deploy && next build`; never point preview at production or run demo seed data against a shared production database. Demo seed is opt-in and contains no credentials or real PII.

## Production

Apply migrations as an explicit deployment step with a reviewed migration artifact and backup/PITR coverage. Use `migrate deploy`, observe readiness, and verify application compatibility before traffic promotion. Keep rollback as a forward-fix migration unless a documented restore is required; do not casually reverse destructive migrations.

## Recovery and maintenance

Use Neon branching, backups, and point-in-time recovery according to the project’s retention policy. For a failed migration, stop promotion, inspect the migration and database state, then use a reviewed forward fix or restore to an isolated branch. Expired idempotency keys and soft-deleted records require a reviewed maintenance job later; this phase does not add background jobs.
