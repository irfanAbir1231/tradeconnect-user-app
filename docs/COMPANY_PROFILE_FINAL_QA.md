# Company profile final manual QA

Do these checks later; none are executed by the automated release phase.

1. Confirm logged-out company routes redirect to login.
2. Confirm a no-company account sees onboarding CTAs in dashboard, settings, and navigation.
3. Create a company; check category loading and Bangladesh country/division/district/upazila cascade.
4. Change each location parent and verify child selections reset; submit an invalid hierarchy and confirm safe reselection feedback.
5. Confirm creation creates one owner membership and selects the first primary company.
6. Confirm the profile shows saved fields, canonical completion, and truthful `not_started` verification state after refresh.
7. Edit as owner/admin, try an empty save, and confirm only changed values persist with updated completion.
8. Verify desktop and mobile navigation show the real selected company without overflow.
9. Sign in as member: profile is readable, private identifiers and Edit are absent, and PATCH is rejected.
10. Sign in as an unrelated user: private company API/profile access fails without data disclosure.
11. Use two browser tabs to create a version conflict and verify reload guidance preserves safe input.
12. Verify logout/login persistence and inspect API responses for no sessions, tokens, audit payloads, documents, or member-private registration/contact data.
13. Inspect database records in an approved environment for transaction/membership/primary invariants and reference-data idempotency.
14. Review Vercel Preview logs and exercise responsive/keyboard/error/session-expiry flows.
15. After merge only, perform final production smoke checks; do not treat Preview as production approval.
