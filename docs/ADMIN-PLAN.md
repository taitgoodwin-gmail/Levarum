# Secure owner dashboard — implemented preview and release criteria

Current baseline: 2026-09-30. The separate admin application, Clerk development account, Neon index/history and isolated private Blob are implemented. The owner has verified taitgoodwin@gmail.com and is bound by immutable server-only ID. This supersedes [historical provider proposals](archive/2026-09-30-pre-redesign/ADMIN-PLAN.md). Production setup is separate and remains gated.

## Authorization and privacy invariants

Every /api/admin action verifies a bearer Clerk session token with authorized parties, immutable ADMIN_OWNER_USER_ID, active online session and verified exact primary owner email. Missing/invalid session is denied; authenticated non-owner is denied; incomplete configuration fails closed. Client navigation and enrollment email restrictions are not authorization. Secrets stay server-side. Public customers do not need accounts.

Sign-in/recovery uses Clerk; no custom password storage or demo credentials. /admin/sign-in and /admin/enroll are private-owner entry surfaces, /admin is inbox, and /admin/leads/:id shows details. Logout/session denial clears records; Back must not resurrect private content. Admin is separately built, noindex and absent from public navigation/sitemap. API responses are private/no-store.

## Owner task design

The owner identifies request intent, reads the relevant answers, replies manually, and records progress. Use clear labels for email follow-up (stored kind plan), call and partner interest. Avoid exposing raw internal field names where a plain label helps. Display type/status/time, useful empty/error states and current index coverage. A shared warm visual foundation does not require promotional marketing layouts in admin.

New, Contacted and Done apply to every type; Booked is restricted to call requests and means an appointment was actually agreed. Status updates do not send email or calendar invitations. Mail correspondence uses hello@levarum.com through Apple/iCloud. Review cadence must be explicitly established before accepting launch traffic.

## Actual API and storage

The deployed single function uses GET /api/admin?action=list with kind/status/page; GET action=detail&id=<opaque ID>; POST action=status with id/status/version/mutationId; POST action=sync for a page of 50 Blob keys. POST enforces same-origin JSON and 4 KB body maximum. Every action is independently authorized.

Blob is durable submission content. PostgreSQL holds index/current status/audit events/sync state. Best-effort indexing never turns a durable public save into false failure. Reconciliation idempotently upserts source records. Status and history commit in one transaction; stale version returns 409 and mutation replay does not duplicate history. Do not merge separate plan/call records merely by email or accept arbitrary Blob URLs from clients.

## Acceptance and evidence status

| ID | Criterion | Current status |
|---|---|---|
| A01 | Owner enrolls/verifies/signs in; production ownership/recovery verified. | Preview enrollment and sign-in passed; production/recovery pending. |
| A02 | Anonymous, expired and non-owner cannot read/mutate, including direct APIs. | Injected authorization tests and hosted missing/fabricated-token denial passed; live non-owner/expired-token probes pending. |
| A03 | Synthetic plan/call/partner and reconciliation are persistent/idempotent. | Isolated preview Blob/Neon baseline passed; preserve and rerun relevant checks after changes. |
| A04 | Status/history persist; concurrency yields 409; successful retry creates no duplicate. | Local PostgreSQL and Neon baseline passed. |
| A05 | Logout clears private UI, Back does not reveal it, revoked token rejected. | Owner browser clearing and Clerk session removal passed; pre-logout JWT replay still pending. |
| A06 | Responsive readable operational UI, keyboard controls, useful errors, no demo auth. | Baseline owner checks and CSS overflow fix recorded; any redesigned UI needs fresh verification. |
| A07 | Public boundary, secrets and private-cache protections hold. | Baseline boundary/security checks passed; rerun on final assets. |
| A08 | Production identity/resources/recovery/backup/rollback and review routine documented/tested. | Outstanding release gate; preview service provisioning is not production acceptance. |

See [verification](verification.md) for evidence limitations and [operations](OPERATIONS.md) for secure configuration names and recovery. No credentials, account IDs, real customer fixtures, paid service commitments or destructive migrations belong in this redesign documentation.
