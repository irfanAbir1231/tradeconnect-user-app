# Authenticated frontend QA

## Browser checklist

1. Open the homepage while logged out.
   - Expected: public navigation shows **Login**; no account name or logout action is visible.
2. Register a fresh user with a 12+ character password.
   - Expected: `/dashboard` opens, the registered name is visible, the old Ahsan Rahman identity is absent, and Login is replaced by Dashboard and Logout.
3. Refresh the page.
   - Expected: the authenticated name and initials persist, with no Login flash.
4. Open the mobile menu.
   - Expected: Dashboard, the signed-in name, and Logout are visible; Login is absent.
5. Visit `/api/v1/me` while signed in.
   - Expected: the safe current-user projection contains the actual account and `business_user`, with no tokens or credentials.
6. Visit `/dashboard/company` for a new user without a company membership.
   - Expected: **No company profile yet** is shown. No fictional company, location, verification state, or completion percentage appears.
7. Click Logout from desktop navigation, mobile navigation, the dashboard sidebar, or the admin shell.
   - Expected: the app redirects to `/login`, Login returns to public navigation, `/api/v1/me` returns 401, and `/dashboard` redirects to login.
8. Sign in again.
   - Expected: the dashboard immediately displays the correct authenticated identity without a manual refresh.

## Temporary data boundary

Real now: authenticated user identity, email, roles, permissions, session validation, and company membership summaries where they exist.

Still mock: request counts, activity, recommendations, documents, inquiries, and verification progress. These surfaces are visibly labeled as demo/workflow-preview data and must not be interpreted as belonging to the signed-in user.
