# Company profile schema mapping

| Requirement | Existing schema | Phase 4A.1 use |
| --- | --- | --- |
| Identity and creator | `User`, `Company.createdById` | Actor creates a company. |
| Zero or more companies | `CompanyMember` | Active owner/admin/member memberships; no user company column is added. |
| Selected primary company | `CompanyMember.isPrimary` | Partial unique index enforces one active non-deleted primary membership per user. |
| Category selection | `Category`, `CompanyCategory` | Active references only; partial unique index enforces one primary category per company. |
| Country/location | `Country`, `Location` | Registration country and optional primary active location. |
| Served markets | `CompanyCountry` | Relationship-labelled country records. |
| Verification readiness | `CompanyVerification` | Creation establishes `not_started`; no verification transition is implemented. |
| Audit | `AuditLog` | Append-only create/update/primary-selection events. |

The migration adds nullable company contact/profile/registration fields, a registration-country foreign key, a registration-country index, and a version column defaulted to `1`. Existing companies remain valid drafts. Repositories filter soft-deleted companies/memberships and project explicit owner DTO fields; raw Prisma models do not cross Route Handlers.
