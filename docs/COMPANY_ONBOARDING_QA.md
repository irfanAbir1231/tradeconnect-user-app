# Company onboarding later QA checklist

1. Sign in with an account that has no company membership and open `/dashboard/company/onboarding`.
2. Confirm unauthenticated navigation redirects to login and an existing-member account redirects to `/dashboard/company`.
3. Confirm dashboard/company empty states and dashboard navigation link to onboarding without showing a fictional company.
4. Complete the four steps, verify Back preserves values, and verify required fields block advancement with an accessible error summary.
5. Select Bangladesh, then division, district, and upazila. Change each parent and confirm children reset and reload safely.
6. Verify categories, countries, and locations use actual reference values rather than hardcoded IDs.
7. Submit once and confirm a pending state prevents duplicate requests.
8. Confirm successful creation redirects to `/dashboard/company`, shows real display name/category/contact/location/completion, and identifies the member as owner.
9. Refresh the dashboard and confirm the server-rendered navigation uses the new company identity.
10. Verify optional/unknown registration fields, reference failures, server validation errors, session expiry, long names, Unicode names, and mobile selectors render safely.
11. Confirm no verification review, document upload, request, marketplace, or admin workflow is implied by the onboarding screen.
