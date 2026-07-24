# Better Auth Schema Mapping

Status: planned for Phase 3A before the `add_auth_core` migration.

Better Auth owns identity credentials and database-backed sessions. TradeConnect owns roles, permissions, company membership, and domain authorization. Better Auth model names are explicitly mapped to the existing Prisma naming convention; no duplicate identity user table is introduced.

| Better Auth model | Logical field | TradeConnect Prisma field | Action | Privacy | Notes |
| --- | --- | --- | --- | --- | --- |
| User | id | `User.id` | Existing | system | UUID primary key; generated consistently with existing domain IDs. |
| User | name | `User.fullName` | Existing, mapped | authenticated owner | Better Auth `name` maps to the existing required full name. |
| User | email | `User.email` | Existing | sensitive | Normalized by application input; unique database field already exists. |
| User | emailVerified | `User.emailVerified` | Add | authenticated owner | Boolean Better Auth compatibility state; `emailVerifiedAt` remains a future domain audit timestamp. |
| User | image | `User.image` | Add | authenticated owner | Optional avatar URL; not populated in Phase 3A. |
| User | createdAt / updatedAt | `User.createdAt` / `User.updatedAt` | Existing | system | Existing UTC-safe timestamps. |
| Session | all core fields | `AuthSession` | Add | sensitive/system | Database-backed session; token is unique and never returned by TradeConnect APIs. |
| Account | all core fields | `AuthAccount` | Add | sensitive/system | Email/password credential hash is nullable, private, and never selected in normal application queries. OAuth token columns are retained only for Better Auth core compatibility and are unused in this phase. |
| Verification | all core fields | `AuthVerification` | Add | sensitive/system | Supports future email verification and password reset; no delivery is configured in Phase 3A. |
| Rate limit | key/count/lastRequest | `AuthRateLimit` | Add | system | Database storage for Better Auth rate limiting. |

## Model and field configuration

- `user.modelName = "User"`; field mapping: `name -> fullName`.
- `session.modelName = "AuthSession"`.
- `account.modelName = "AuthAccount"`.
- `verification.modelName = "AuthVerification"`.
- `rateLimit.modelName = "AuthRateLimit"`, using database storage.
- `UserRole`, `Role`, `Permission`, and `RolePermission` remain TradeConnect-owned canonical authorization tables. They are not fields on Better Auth sessions or accounts.

## Migration decisions

`User.emailVerified` and `User.image` are additive and preserve all existing relations. Auth foreign keys use `ON DELETE RESTRICT` so removing an auth session or account cannot remove TradeConnect domain history. A reviewed partial unique index will prevent duplicate active platform-level `UserRole` assignments where `company_id IS NULL`; Prisma cannot express this partial uniqueness directly.
