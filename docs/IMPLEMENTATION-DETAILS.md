# Implementation decisions and verification boundaries

Current baseline: UX correction, 2026-09-30. [Earlier work packages](archive/2026-09-30-pre-redesign/IMPLEMENTATION-DETAILS.md) are historical. This document describes the existing architecture and selected redesign, not a claim that its new UI is verified.

## Application and design handoff

React 19, strict TypeScript, Vite, Node 24 and the existing npm lockfile remain. Separate public/admin HTML entries and the import-boundary check protect public assets. Retain /, /how-it-works, /what-we-automate, /questions, /partners, /start, /privacy, /designs/ and /admin routes; the historical gallery stays labeled. Preserve direct loading, refresh and Back behavior. No router migration is necessary merely to change the design.

Use shared public primitives and design variables for typography, spacing, controls, surfaces and focus. Create editable Figma frames with components, variables, Auto Layout, mobile/desktop sizes and annotations for interactions not visible in static screenshots. Prototype and logo choices are reviewed as product decisions; Figma-to-code tooling does not validate them automatically. The original source snapshot is preserved.

The new intake has four conceptual states: questionnaire → guidance → optional contact → saved request. Contact distinguishes plan/email-follow-up from call intent. Guidance is local, qualitative and task-specific; it does not invoke the API or claim saving. Editing returns to the questionnaire with answers retained. Printing outputs only useful guidance. No savings estimator or arbitrary ranked first recommendation is introduced.

## Current interface and data architecture

- Public saves: POST /api/leads and POST /api/partners, same schemas and saved:true semantics as [requirements](REQUIREMENTS.md). Keep the existing timeout/request-ID/retry helper and locked pending controls.
- Owner API: GET /api/admin?action=list with kind/status/page; GET /api/admin?action=detail&id=<opaque ID>; POST /api/admin?action=status with id, status, version, mutationId; POST /api/admin?action=sync. The previous proposed REST endpoint shapes were never the deployed contract.
- Every owner action authenticates independently. Server verifies Clerk session token, immutable owner ID, active online session, exact verified owner primary email and allowed origin. Private API responses are no-store. Server keys never enter public assets.
- Private Blob is immutable submission evidence. Neon PostgreSQL stores index/status/history. Successful Blob save remains success if indexing fails; reconciliation upserts missing index entries without altering content. Transactional status/history writes use version checks and mutation replay protection.
- Preview uses isolated Blob and development Clerk/Neon. Production resources and identity setup are separately gated. No destructive migration or data cleanup is part of the UX change.

## Verification matrix

| Area | Required fresh evidence |
|---|---|
| Questionnaire | Missing field/task validation; every selected task has relevant content; guidance needs neither contact nor a save; edit retains answers; no numerical savings; no browser-input persistence claim. |
| Contact | plan and call intents; consent unchecked; pending lock; invalid email; failed save retains input; unchanged retry identity; durable success; call explicitly unbooked. |
| Partner | Required fields/bounds/categories/consent; failed and successful private save; truthful acknowledgement. |
| Routes and layouts | Direct entry, refresh, Back and recovery; 320/390/768/1440px; both themes; mobile menu open/close; logo at favicon scale; screenshots compared with reviewed design. |
| Accessibility | Keyboard and focus order; labels/errors/landmarks; semantic menu/accordion state; contrast; reduced motion; theme persistence; distinguish automated scans from actual screen-reader checks. |
| Admin and privacy | Boundary check; direct authorization failures; owner inbox/detail/status/history; stale concurrent update; retry idempotence; reconciliation; logout/Back; no private data in screenshots/logs/assets. |
| Commands | npm test; npm run build including boundary/typecheck; meaningful browser/security checks. Record commit/deployment and test limitations. |

## Release gates

1. Design evidence: alternatives, selected flow, logo contexts and editable responsive frames; decisions and assumptions labeled.
2. Preview evidence: implemented public/operator journeys, successful build/tests, fresh browser/accessibility results and exact synthetic storage checks.
3. Production readiness: live negative-session/revocation probes; production Clerk/domain and database isolation; recovery/backup procedure; agreed manual review cadence and privacy operations.
4. Owner visual review of the final preview before homepage replacement. Record rollback deployment before promotion. A rollback changes code, not the stored records.

Baseline results are in [verification](verification.md); they must not be reused as proof of changed UI. A failing or unperformed check stays visible in the evidence record.
