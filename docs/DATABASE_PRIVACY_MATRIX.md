# TradeConnect Database Privacy Matrix

## Phase 4A.4 company profile note

Owner/admin company projections may include private contact and registration data; member-safe and navigation projections omit them. Company audit data stores only changed field names and version metadata, never contact, address, registration, session, token, cookie, document, or raw-error values.

This matrix is a serialization policy, not an authorization implementation. Server repositories must select only fields appropriate to the caller. A database foreign key never grants access.

| Model | Public projection | Authenticated owner/company member | Assigned staff | Admin only | System-only / never returned normally |
| --- | --- | --- | --- | --- | --- |
| User | none beyond approved display name | own profile; contact fields | assigned operational contact as needed | account status | email verification timestamps, role/security metadata |
| AuthSession, AuthAccount, AuthVerification, AuthRateLimit | none | none | none | none | session tokens, password hashes, verification values, rate-limit keys and IP/user-agent data |
| Company | approved name, slug, description, categories, served locations, safe verification badge | full company profile for members | operational profile | account, suspension, verification details | internal flags and moderation metadata |
| CompanyMember | none | company membership as scoped | assigned operational need | all membership and invitation state | membership audit history |
| Role, Permission, RolePermission, UserRole | none | none | none | authorization configuration | all assignments and revocation data |
| Category, Country, Location | active reference names/codes | same | same | inactive/admin metadata | soft-delete metadata |
| BusinessRequest | only explicit fields copied to a published listing | owner/company-scoped request, including private budget | assigned request fields | full request and workflow data | deleted markers and unrestricted raw record |
| RequestStatusHistory | none | own timeline | operational timeline | full transition reason/actor | append-only mutation metadata |
| RequestAssignment | none | assigned team display only if approved | assigned/current assignment | assignment history and reasons | internal assignment metadata |
| RequestAdminNote | never | never | assigned staff if allowed | internal notes | deleted/redaction metadata |
| Document, RequestDocument | never | owner metadata/actions without storage key | review metadata as needed | review and retention controls | storage key, checksums, private content, scan internals |
| CompanyVerification, VerificationChecklistItem | safe company status only | own company status/checklist summary | assigned case | decisions, reviewer notes, checklist details | verification audit and decision metadata |
| VerificationDocumentReview | never | safe status only | assigned review data | full document decisions/notes | storage access and audit metadata |
| MarketplaceListing | published `publicFields` projection only | own draft/moderation fields | moderation fields | full listing, reasons, counters | source private request, internal notes, private fields |
| MarketplaceInterest | confirmation only | own submitted interest | assigned lead data | full interest and message | abuse/risk metadata |
| Inquiry | no contact/message fields | sender’s own inquiry status | assigned inquiry data | full sender contact, company, message, activities | internal audit and anti-spam metadata |
| InquiryActivity | never | own safe timeline if allowed | assigned timeline | internal notes and actor details | audit correlation data |
| TechnologyProduct | published catalogue fields | provider-owned management fields | operational catalogue fields | draft/provider/moderation fields | unpublished internal metadata |
| DemoRequest | confirmation only | own submitted request | assigned lead fields | full business context and contact | internal routing/audit data |
| Notification, NotificationPreference | none | own notifications/preferences | own notifications | operational delivery diagnostics | dedupe and delivery internals |
| AuditLog | never | never | never unless explicit audit role | controlled audit access | before/after JSON, IP, user agent, request correlation |
| IdempotencyKey | never | never | never | controlled operational inspection | request fingerprints and cached responses |

Sensitive fields include user/company email and phone, private request budgets, company documents and storage keys, verification decisions, internal notes, inquiry messages, and audit metadata. Public marketplace previews must never include email, phone, private documents, internal notes, exact budget, or private request fields.
