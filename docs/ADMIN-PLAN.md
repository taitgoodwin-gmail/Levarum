# Secure owner dashboard — first-release plan

> Implementation checkpoint (2026-09-29): public flows are implemented and verified in a hosted preview; private admin code is implemented but Clerk/Neon setup and live admin tests remain incomplete. Production is unchanged. [Verification](verification.md) and [operations](OPERATIONS.md) supersede historical planning-state statements below.


User decision: include a secure dashboard with a login for the owner/admin. This supersedes the earlier admin deferral. Owner login email is taitgoodwin@gmail.com (user-confirmed); public contact remains hello@levarum.com regardless of that choice. No accounts have been provisioned and no invitations sent.

## Account and authorization

Recommend Clerk for authentication, using its React integration in the separate Vite admin entry and its backend verification on every private endpoint. This retains the current application stack. Clerk documents React/Vite support and server verification; provider setup, available sign-in methods and costs must be checked during implementation, not assumed free.

Use invite-only enrollment for the initial owner. After the owner verifies their chosen email, record their immutable provider user ID in a server-only owner allowlist. Authorization is based on that ID, not a client-provided role, email suffix or hidden navigation. An authenticated non-owner gets 403. Missing/invalid/expired credentials get 401. Public marketing, intake and partner submissions do not require accounts. Do not add public customer sign-up.

Use provider-managed sign-in and account recovery, not custom password storage. Prefer passwordless email verification for the selected inbox, with an additional factor or passkey where supported and configured. User enters credentials/codes directly. Confirm production account ownership, domains, verification/recovery access and session policy before launch. Require server session verification that enforces revocation, not merely a client redirect; verify replay after sign-out fails.

Authenticate same-origin admin requests with provider session tokens, accept only session tokens and verify issuer, expiry and authorized party/origin through the official SDK. Reject unexpected origins, fail closed if verification is unavailable and keep secret keys server-side. Distinct development and production environments must not share real lead fixtures.

## Screens and behavior

`/admin/sign-in`: branded sign-in with safe return URL restricted to the admin application. Signed-in non-owners see access denied, never a dashboard flash.

`/admin`: inbox with customer/partner type, status and pagination; counters must match the indexed dataset or explicitly indicate partial synchronization. Show loading, empty, error and session-expired states. No browser-local seeded data in production.

`/admin/leads/:id`: selected intake/partner details, call preferences and a mailto reply action. Status actions support New, Contacted, Booked and Done, with correction and history. Partner applications are not forced through a booking step. A status change does not send an email or create a calendar event. “Booked” means a meeting actually arranged by the owner.

Sign-out clears visible records and cached responses. Back navigation after sign-out must not reveal private content. Admin pages are noindex, omitted from public sitemap/navigation and served with private/no-store API responses. These are supporting protections; authorization remains server-enforced.

## Storage and API architecture

Keep existing private Blob lead records as immutable submission evidence. Recommend a small managed PostgreSQL database for the admin index, current status and transactional audit trail; provider selection/provisioning and cost are still implementation prerequisites. This avoids pretending concurrent status updates in overwritten Blob JSON are atomic.

Proposed tables: `lead_index` (opaque ID, unique source Blob key, type, received_at, status, version), `lead_status_events` (event ID, lead ID, old/new status, actor user ID, timestamp, unique mutation ID), and `sync_state` (source cursor and last successful synchronization). Do not duplicate personal content into audit logs. Read details from the allowlisted private Blob key after authorization; never accept arbitrary Blob URLs from the browser.

Existing public saves remain successful once Blob storage succeeds. Index each successful write best-effort; a repeatable server-side reconciliation scans private lead prefixes and upserts by unique source key, so an indexing failure cannot lose a saved lead. Backfill existing records through this same process without deleting or changing them. Show last sync time and indexing problems to the owner; complete reconciliation is a launch check. Do not merge separate plan/call submissions solely by email; preserve the original records and label their type.

Proposed private endpoints: GET `/api/admin/leads` with bounded page cursor/type/status; GET `/api/admin/leads/:id`; PATCH `/api/admin/leads/:id/status` with validated status, expected version and mutation ID. Implement the route mechanism supported by the existing Vercel Functions deployment. Status update and audit insertion occur in one transaction. A stale version returns 409 and asks the UI to refresh; a retry with the same mutation ID returns the recorded result. GET routes and details are authorized independently of UI state. Mutation requests also enforce content type, size and origin restrictions.

## Acceptance criteria

| ID | Observable pass condition |
|---|---|
| A01 | The selected owner can enroll, verify the account and log in to production; recovery path is verified without exposing credentials. |
| A02 | Anonymous, expired-session and authenticated non-owner requests cannot list, view or change records, including direct API requests. |
| A03 | Synthetic plan, call and partner records plus existing records appear after idempotent reconciliation; duplicate indexing does not duplicate leads. |
| A04 | Status survives refresh; history identifies actor/time; stale concurrent update returns 409; retry does not create duplicate events. |
| A05 | Logging out clears private UI and the old session cannot fetch data; changing the URL to another lead ID never bypasses authorization. |
| A06 | Mobile/desktop dashboard matches the admin kit's design intent, with keyboard-operable controls, useful empty/error states and no demo passwords. |
| A07 | Public bundle excludes admin/auth data paths; secrets and private records never appear in assets, logs, screenshots or caches. |
| A08 | Production-only settings, owner allowlist, provider recovery, datastore backup/recovery and deployment rollback are documented and tested appropriately. |

## Delivery sequence

First validate the chosen identity setup and account ownership in development, then implement owner-only API protection using synthetic records. Build the separate admin entry and inbox/detail screens. Add the transactional status store, idempotent index and audit workflow. Backfill and reconcile in a controlled preview environment, then run the authorization and session test matrix. Enroll the production owner through the provider's normal flow, deploy and verify actual owner access before the combined launch is declared complete.

Do not make new paid commitments or accept provider terms on the user's behalf merely because this plan recommends a provider. Routine reversible implementation can proceed when implementation is requested; required account setup should be brought to the user only at the concrete setup step.

## References checked

- [Clerk React/Vite quickstart](https://clerk.com/docs/react/getting-started/quickstart)
- [Clerk backend request authentication](https://clerk.com/docs/reference/backend/authenticate-request)
- [Clerk access restriction modes](https://clerk.com/docs/guides/secure/restricting-access)

These establish candidate provider capabilities. They do not establish that Levarum has an account, keys, an approved plan or a completed integration.
