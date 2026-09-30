# Implementation decisions and verification boundaries

Current baseline: task-first exploration and direct contact, 2026-09-30. [Earlier work packages](archive/2026-09-30-pre-redesign/IMPLEMENTATION-DETAILS.md) are historical. This document describes the implemented architecture and redesign. Previous public browser/build/storage evidence is recorded in [verification](verification.md#ux-redesign-verification--2026-09-30). Current explorer/contact source is implemented; fresh v2 tests, browser checks and deployment are pending. Authenticated admin, manual accessibility and production gates remain open.

## Application and design handoff

React 19, strict TypeScript, Vite, Node 24 and the existing npm lockfile remain. Separate public/admin HTML entries and the import-boundary check protect public assets. Retain /, /how-it-works, /what-we-automate, /questions, /partners, /start, /contact, /privacy, /designs/ and /admin routes; the historical gallery stays labeled. Preserve direct loading, refresh and Back behavior. No router migration is necessary merely to change the design.

Use shared public primitives and design variables for typography, spacing, controls, surfaces and focus. Create editable Figma frames with components, variables, Auto Layout, mobile/desktop sizes and annotations for interactions not visible in static screenshots. Prototype and logo choices are reviewed as product decisions; Figma-to-code tooling does not validate them automatically. The original source snapshot is preserved.

The explorer has unselected/selected task states with immediate local guidance. No business/hours collection or form-submit gate precedes advice. ContactRequest is reusable as direct /contact or an in-memory contextual surface inside /start; visibility changes retain the existing tab draft. Contextual task and purpose changes reset consent. Direct contact requires an actual description when no task is selected. Business is optional; hours is omitted. A valid public task query may initialize exploration, but email/message never enter URLs. Printing outputs only useful guidance. No savings estimator or arbitrary task ranking is introduced.

## Current interface and data architecture

- Public saves: POST /api/leads explicitly adds numeric schemaVersion2 while preserving the unversioned parser/normalization/hash byte shape; POST /api/partners is unchanged. See [exact v2 contract](LEAD-V2-CONTRACT.md). V2 accepts omitted business/hours and requires known task or meaningful message; new UI never fabricates values. Keep saved:true/reference semantics, timeout/request-ID/retry helper and locked pending controls.
- Owner API: GET /api/admin?action=list with kind/status/page; GET /api/admin?action=detail&id=<opaque ID>; POST /api/admin?action=status with id, status, version, mutationId; POST /api/admin?action=sync. The previous proposed REST endpoint shapes were never the deployed contract.
- Every owner action authenticates independently. Server verifies Clerk session token, immutable owner ID, active online session, exact verified owner primary email and allowed origin. Private API responses are no-store. Server keys never enter public assets.
- Private Blob is immutable submission evidence. Neon PostgreSQL stores index/status/history. Successful Blob save remains success if indexing fails; reconciliation upserts missing index entries without altering content. Transactional status/history writes use version checks and mutation replay protection.
- Preview uses isolated Blob and development Clerk/Neon. Production resources and identity setup are separately gated. No destructive migration or data cleanup is part of the UX change.

## Verification matrix

| Area | Required fresh evidence |
|---|---|
| Task explorer | Unselected prompt; all five task choices reveal matching content immediately; no business/hours/email gate or POST; task switching and contextual Back retain state; no numerical savings; no refresh persistence promise. |
| Contact | Fresh /contact with genuine message and no fabricated task/context; contextual selected-task path; optional business omission; v2/legacy contract regression; plan/call purposes; reset consent; invalid/whitespace message; pending lock; retained failure; stable retry; durable receipt; call unbooked. |
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

Both historical baseline and fresh redesign results are in [verification](verification.md); only explicitly repeated checks support the changed UI. A failing, incomplete or unperformed check stays visible. The Figma reference has documented hero/card-count/native-control differences; it is not application-wide pixel-perfect acceptance.


## Current conceptual handoff and performance baseline

New Figma alternatives: concept A desktop/mobile `16:3`/`16:4`, concept B `16:5`/`16:6`. Selected journeys page `18:2`: explorer `18:3`, contact `18:4`, receipt `18:5`, failed/retry `18:6`, owner workspace `18:7`. [Current traceability](UX-REDESIGN.md) links them. These are editable conceptual native-field references; real browser controls and states differ. No pixel-perfect parity or working form behavior is inferred from a frame.

[Performance baseline](PERFORMANCE-BASELINE.md) measures a frozen previous local build, not this source or the hosted deployment: Lighthouse13.5.0/Chrome154, three mobile Home runs median92 (92–99) and desktop100 (99–100), with route spot checks and duplicate font-chain findings. Repeat under the recorded conditions after implementation; neither navigation scores nor local LCP values establish field Core Web Vitals, interaction quality or screen-reader compliance.
