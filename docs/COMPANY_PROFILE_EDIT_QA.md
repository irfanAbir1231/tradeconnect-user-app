# Company profile view and edit later QA checklist

1. Sign in with no company membership. Confirm `/dashboard`, `/dashboard/company`, settings, and sidebar show onboarding CTAs without a fictional company.
2. Create a company through onboarding, refresh, and confirm its real display name, role, category, completion, verification `not_started` state, and timestamps render in `/dashboard/company`.
3. Confirm the owner sees Edit in the profile, dashboard card, settings, and sidebar; confirm a member does not.
4. As a member, request the edit route and PATCH endpoint directly. Confirm the route redirects safely and the API rejects the mutation.
5. As an unrelated account, request the private company endpoint. Confirm it fails closed without exposing profile details.
6. Open Edit and confirm real saved values preload. Change one field, save once, and confirm the profile, dashboard, settings, and sidebar refresh without a manual browser refresh.
7. Attempt Save with no changes, invalid email/year, invalid category, and invalid location. Confirm accessible errors preserve safe input and focus the error summary.
8. Change registration country, division, and district in turn. Confirm each dependent selector resets, stale responses do not replace current choices, and valid canonical IDs persist.
9. Confirm private contact and registration fields appear only for owner/admin UI and never in navigation props, URLs, metadata, console logs, or public pages.
10. Edit in a second tab, then save the stale first tab. Confirm version conflict requires reload/review and does not overwrite newer data.
11. Soft-delete the company or deactivate membership in a controlled test environment. Confirm the next load fails closed to the no-company/onboarding state and stale private information is not retained.
12. Check narrow mobile, tablet, desktop, long Unicode company names, keyboard navigation, focus states, and screen-reader labels/error announcements.
