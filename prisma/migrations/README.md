# Prisma migrations

The initial migration is intentionally not generated in this workspace because `DIRECT_URL` is not configured. Once a safe development Neon database is available, run:

```text
npm run db:format
npm run db:validate
npm run db:generate
npm run db:migrate -- --name init_domain
```

Review the generated SQL for foreign keys, delete behavior, enum values, Decimal columns, and indexes before accepting it. Do not create a migration from a production database in a local or preview environment, and do not use `db push` as the production migration strategy.
