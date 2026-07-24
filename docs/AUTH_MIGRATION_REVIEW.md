# Authentication migration review

Migration reviewed: `20260724135836_add_auth_core`

## Result

| Check | Result | Notes |
| --- | --- | --- |
| Additive schema changes | PASS | Adds four dedicated Better Auth tables and two nullable/safe-default user fields. |
| Destructive statements | PASS | No `DROP`, data deletion, or table replacement statements. |
| Existing identity preservation | PASS | The existing `users` table remains the canonical user record. Better Auth maps its `name` field to `users.fullName`. |
| Existing role model preservation | PASS | Existing `roles`, `permissions`, `role_permissions`, and `user_roles` tables remain authoritative. |
| Foreign-key deletion behavior | PASS | Auth session/account relations use `ON DELETE RESTRICT`; existing user deletion is not broadened by this migration. |
| Token and credential exposure | PASS | Tokens and password hashes are stored only in private auth tables and are not selected by public API contracts. |
| Active default-role uniqueness | FIXED | Added a PostgreSQL partial unique index for active platform-level user roles, which Prisma cannot model directly. |
| Apply status | PENDING | This review must be completed before the migration is applied to the Neon development database. |

## Schema mapping

See [BETTER_AUTH_SCHEMA_MAPPING.md](BETTER_AUTH_SCHEMA_MAPPING.md) for the Better Auth-to-Prisma model mapping.

## Custom SQL rationale

PostgreSQL treats `NULL` values as distinct in the existing `@@unique([userId, roleId, companyId])` constraint. The added partial index enforces one active, platform-level role grant per user/role pair while allowing separate company-scoped grants and retaining historical revoked grants:

```sql
CREATE UNIQUE INDEX "user_roles_active_platform_role_unique"
ON "user_roles"("userId", "roleId")
WHERE "companyId" IS NULL AND "revokedAt" IS NULL;
```

This is additive and does not alter existing rows. The initial role assignment code handles a uniqueness conflict by reading the already-created assignment, so concurrent sign-ups fail closed rather than creating duplicate access grants.
