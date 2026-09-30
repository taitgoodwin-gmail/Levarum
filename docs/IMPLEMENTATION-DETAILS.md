# Remaining implementation and release decisions

> Implementation checkpoint (2026-09-29): public flows are implemented and verified in a hosted preview; private admin code is implemented but Clerk/Neon setup and live admin tests remain incomplete. Production is unchanged. [Verification](verification.md) and [operations](OPERATIONS.md) supersede historical planning-state statements below.


Status: planning only. Confirmed first release includes the public marketing site, intake, partner form, manual call requests AND a secure dashboard with a private owner/admin login. The administrator email is user-confirmed as taitgoodwin@gmail.com. This document supplements PLANS.md and does not authorize execution.

## Recommended defaults

Use the existing React/TypeScript/Vite stack and Vercel project. Do not replatform to Next.js or add an AI dependency for the visual migration. Convert the supplied JSX to typed modules; use the source component definitions and token values, not the opaque prebuilt bundle. Preserve deliberate design details and document changes needed for accessibility or truthful behavior.

Keep the existing private Blob store and the plan/call endpoint. Add a separate partner endpoint with shared validation and storage utilities where appropriate. Keep the public and admin code paths separate, but release them together. Existing authorized private-store access is a recovery path; the secure dashboard is required for first-release acceptance.

Manual scheduling through hello@levarum.com is the first-release default. Automated email notifications are optional until an owner review routine is established; plan-email delivery is deferred. No new paid service is needed merely to preview the design.

Until numerical assumptions are reviewed, use qualitative personalized opportunities and label static design-example figures as illustrative. Remove unsupported industry percentages from release copy or replace them with independently verified, precisely attributed evidence. Retain the visual section structure. Never turn a source comment or a README assertion into proof of a business outcome.

## Page and state inventory

| Surface | Required states | Production connection |
|---|---|---|
| Home | Hero/example, problem band, before/after examples, proof placeholder, closing CTA; both themes | Start links to /start; example selector has clear illustrative behavior and does not imply a saved intake |
| How it works | Three steps, handover explanation, boundaries and CTA | Claims match actual offer; links work directly and on refresh |
| What we automate | Five jobs, ranked examples, clear call to action | No internal lead data or operator-only implementation catalog |
| Questions | Actual number of FAQ items; open/closed; keyboard focus | Count matches items; no promise of functionality not implemented |
| Partners | Empty, invalid, submitting, saved, failed, reset | POST /api/partners; privacy/contact consent; acknowledgement only after durable save |
| Intake | Business/hours, challenge selection, explanation, email gate | Explicit choices; retained answers on Back; shared schema |
| Game Plan | Pending, saved plan, retryable error | POST /api/leads intent plan; reviewed calculations only; printable content |
| Call request | Preferences, pending, saved, failed | POST /api/leads intent call; no confirmed appointment until human agreement |
| Privacy | Current collection/use/storage/contact information | Includes partner data and actual providers; no invented retention commitment |
| Not found | Clear recovery action | Unknown path does not silently display the intake |
| Design gallery | Current reference and archived versions, demo labels | Only synthetic data; link to matching Figma version |

## File-level work packages

P1 — Source and tokens: add `design/current/README.md` with source checksum and reviewed source snapshot; add `src/styles/levarum/` for base, color, typography, spacing, layout, motion and theme tokens. Keep legacy tokens until the pilot is replaced; prevent accidental global CSS overrides during comparison.

P2 — Components: add typed core, forms, navigation, feedback and patterns under `src/ui/`. Prioritize Logo, Button, Card, Eyebrow, SectionBand, NavBar, Footer, ThemeToggle, TextField, SelectField, ChoiceChip, CheckRow, ProgressSteps, Accordion and opportunity/number components. Import only what the production screens use. Keep browser APIs inside effects or handlers, clean up observers and timers, and avoid `window.LevarumDesignSystem_*` globals. Do not loosen strict TypeScript to accommodate the bundle.

P3 — Marketing/routing: implement page modules in `src/marketing/`, with shared public shell. Keep normal anchors and pathname routing in `src/App.tsx` initially, which supports direct entry and browser Back without a new router dependency. Use native in-page anchors for sections. If client-side navigation is introduced, add route focus and scroll restoration deliberately. Map known old hash links (#home/#how/#what/#questions/#partners) to canonical paths; preserve unrelated section hashes. Update `vercel.json` without intercepting API or static gallery requests.

P4 — Intake: add the new public flow under `src/prospect/`, using `step1`, `step2`, `step3`, `gate`, `plan`, `call`, and `confirmed` states. “confirmed” means the request was saved, not a booked meeting. Isolate API calls in a public request helper with a timeout, stable per-intent request IDs, pending state and explicit saved:true check. Keep input in memory, not URLs or browser lead storage. Do not mount old prototype auth or browser submission stores.

P5 — Data contracts: preserve existing records and parse old input values. Extend the business allowlist with the exact new kit labels while accepting old labels; new UI submits the new labels and server keeps the submitted accepted value. Existing pain IDs remain stable. Do not reinterpret historical numeric estimates. Add partners as a separate record type and endpoint with the bounds in REQUIREMENTS.md. Keep versioned privacy and server-generated timestamps. Add no public listing/read endpoint.

P6 — Boundaries and verification: extend `scripts/check-boundary.mjs` to cover public entrypoints, marketing and shared public UI so moving a file cannot evade the rule. Verify reachable public imports exclude operator modules, `src/store/submissions.ts` and `src/domain/catalog.ts`; review domain helpers for accidentally exposing internal fields. Add meaningful tests for the import boundary and changed input contracts. Keep generic visual primitives free of operator data. Do not enforce an obsolete visual rule when it conflicts with the user-supplied current design; document any intentional policy revision.

P7 — Content and discoverability: prepare a page-by-page copy audit, canonical URLs, titles, descriptions, social preview, favicon and sitemap. Public previews and admin pages must not be included in the sitemap. Do not index result states or expose user input in metadata. Use the supplied brand assets; inspect actual assets before creating substitutes. Confirm content is readable if fonts load slowly and that reduced motion leaves meters/figures visible.

P8 — Review/release: assemble preview screenshots, behavior evidence and a change summary, then update Figma from the reviewed implementation. Keep Figma fidelity work distinct from functional verification. The approved public pages replace the pilot only after review. Archive old visual references with clear labels rather than removing provenance.

## Testing matrix

| Area | Required check | Pass condition |
|---|---|---|
| Contracts | Old and new accepted business labels; unknown enum values; partner bounds; consent | Valid supported inputs save; invalid/oversized inputs do not |
| Retry | Double click, lost response, identical retry, changed answers | UI prevents parallel submission; identical request/content deduplicates; changed content cannot overwrite a different lead |
| Failures | Missing storage, rejected save, timeout, notification failure, 429 | No false success; inputs preserved; saved lead remains saved if notification fails |
| Rendering | All routes at 320, 390, 768 and 1440px, both themes | No unintended overflow, clipping or hidden essential actions |
| Interaction | Keyboard navigation, step Back, FAQ, theme, validation focus | No traps; visible focus; state communicated semantically |
| Motion | Reduced motion and observer fallback | Content/figures remain visible and meaningful |
| Privacy | Production assets and network requests | No secret, lead object, operator store or unsanctioned AI call exposed |
| Estimation | 31 nonempty pain subsets × 4 bands, if enabled | Bounds valid, documented cap enforced, rows reconcile, stable tie-breaking |
| Release | Deep links, HTTPS, synthetic plan/call/partner save + private retrieval | Matching records and truthful public confirmations verified |

Unit and API tests use isolated fakes for storage and notification. Browser verification uses synthetic data. Do not repeatedly send production messages or enumerate real records for tests. Add automated browser testing only when it meaningfully protects the changed flows; the current npm test/build pipeline remains the minimum required CI check. Documentation edits alone do not need application tests.

## Release gates and sequencing

Gate A, source readiness: current ZIP imported and inventory complete; field mappings and source defects documented. Deliverable: design inventory and implementation file map. No service/provider decision blocks this gate.

Gate B, visual readiness: marketing pages and complete intake states rendered at mobile and desktop sizes with demo status made clear. Deliverable: preview URL, comparison screenshots and a short deviations list. New forms must not claim real saves during this stage.

Gate C, operational readiness: real private saves and owner follow-up established; failure tests pass; privacy matches actual processing. Deliverable: verification matrix tied to commit and redacted synthetic record references. No database or email credential appears in the document.

Gate D, user review: user can inspect the supplied design as a working preview; review changes are recorded and resolved. Deliverable: accepted visual direction and final scope. This gate comes from the prior preview-before-replacement plan, not from a blanket Codex permission requirement.

Gate E, production readiness: deploy reviewed commit, inspect required routes, verify the three synthetic submission types, record rollback and reopen the public site for review. Deliverable: release record and updated Figma/gallery. If the existing production deployment continues receiving pilot traffic during work, do not disrupt it merely to stage the preview.

Each gate should yield a usable artifact in order; avoid promising all gates in one 30-minute window. Produce a schedule after Gate A based on actual component conversion effort and available integrations. Authentication and email-provider setup can introduce user-dependent elapsed time, which is separate from implementation effort.

## Secure admin — required in first release

Add milestone M3A before Gates C–E. Recommended identity provider: Clerk using its React SDK for the Vite admin entry and backend SDK for server verification. Account availability and any cost must be checked before provisioning; the owner account must belong to the user. Use server-verified sessions and an explicit owner allowlist, not domain-wide implicit access. Deny access by default. Keep admin in a separate entry/build so its layout and code do not enter the public bundle.

Admin needs private paginated reads, typed customer/partner details, persisted status changes and an audit trail; exact storage for status history must be chosen before implementation. Test login, logout, expired sessions, direct unauthorized API requests, status correction and stale updates. Introduce no migration that loses existing Blob records. Decide whether initial records are read in place or copied through a reversible migration, then document reconciliation. No client-side owner/levarum credential check is acceptable.

## Decisions that actually require owner input

First-release admin scope is confirmed; owner/admin login email is confirmed as taitgoodwin@gmail.com. Before production promotion, settle who reviews leads and how often, confirm any delivery/partner commitments in copy, and determine whether numerical estimates are sufficiently supportable to publish. A calendar provider is needed only if manual scheduling is replaced. Authentication setup is now on the critical path. Provider credentials are entered through the service's normal secure flow, never pasted into planning documents.

Until provider setup is resolved, preview preparation can continue, but secure-admin acceptance cannot be claimed. Manual scheduling remains the first-release default. Independent design review, component mapping and preview preparation can proceed once implementation is requested; elapsed time does not approve a pending decision.
