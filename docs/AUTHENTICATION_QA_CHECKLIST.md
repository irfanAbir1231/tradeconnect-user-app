# Authentication QA checklist

- [ ] Register a development account with a 12+ character password.
- [ ] Confirm the account receives exactly one active `business_user` role and an audit entry.
- [ ] Sign in, reload, and confirm session persistence.
- [ ] Sign out and confirm protected dashboard/admin routes redirect to `/login`.
- [ ] Confirm `/api/v1/me` returns `401` without a session and no secrets/credential fields with one.
- [ ] Grant a development role with the CLI; verify admin/super-admin confirmation is required.
- [ ] Confirm `business_user` is redirected from `/admin` to `/unauthorized`.
- [ ] Confirm an authorized role can reach only navigation items allowed by its database permissions.
- [ ] Confirm request, marketplace, company, and verification admin routes deny users without their respective permission.
- [ ] Exercise repeated sign-in attempts and verify Better Auth rate limits without verbose account-existence errors.
- [ ] Confirm public listing pages and `GET /api/v1/me` never expose session tokens, password hashes, document data, or admin notes.
- [ ] Before production: configure real email verification delivery, retain secure cookies, confirm the deployed `BETTER_AUTH_URL`, and run browser authorization tests.
