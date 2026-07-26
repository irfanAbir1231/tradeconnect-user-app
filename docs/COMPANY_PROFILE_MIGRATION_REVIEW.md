# Migration review: `complete_company_profile_foundation`

The migration adds nullable company contact/profile/registration columns, `version` with default `1`, a registration-country foreign key/index, and partial unique indexes for one active non-deleted primary membership per user and one primary category per company.

It is additive and forward-only: existing companies remain valid, and it does not delete/rewrite records, touch auth tables, modify applied migrations, seed users, or insert credentials. If the partial indexes find a specific legacy duplicate, stop and resolve it with a reviewed forward repair; do not reset, use `db push`, or broadly delete data. The migration is approved for `prisma migrate deploy` after this review.
