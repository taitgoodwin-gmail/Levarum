# Apply the supplied Levarum design system to the live pilot


This is the living execution plan for the design migration. Maintain Progress, Surprises & Discoveries, Decision Log and Outcomes & Retrospective during execution. Repository guidance is in AGENTS.md. This document is a plan, not authorization to begin implementation while the user is requesting planning.

## Purpose and context


A visitor should see the supplied five-page marketing website, complete a three-step Game Plan intake, save a private lead and request a real human follow-up. The owner should be able to retrieve customer and partner requests. Booking and admin demos must not masquerade as working production systems.

The repository is a React 19/TypeScript/Vite app deployed on Vercel, using Node 24 and npm. `src/App.tsx` selects the active public UI; `src/prospect/PilotApp.tsx` implements the current pilot; `api/leads.ts` and `server/leads.ts` validate and privately save leads. `src/domain/pains.ts` holds current allowed inputs. `vite.config.ts` exposes the lead handler locally. `scripts/check-boundary.mjs` protects separation from operator code. `vercel.json` handles deployment routes. `/designs/` is an older static gallery, not the requested new design.

The source ZIP is `/Users/tag-mba-2066/Downloads/Levarum Design System.zip`, checksum `5e8c75bfc2ceb504d3eeee60470bb28d375aabd79098c0d2e0d9b25066c5b0f3`, extracted at `../levarum-design-system/` relative to this repo. A fresh clone needs this source imported in milestone 1. Its marketing kit contains Home, How, What, Questions and Partners; intake and admin are separate kits. Global React/browser bundle loading in these kits needs conversion to production module imports. The public contact is hello@levarum.com. The old Figma file and gallery still contain older screens.

## Progress


- [x] 2026-09-29: Inspect supplied package, current API and active public UI; identify source/version mismatch.
- [x] 2026-09-29: Document requirements, workflows, acceptance, assumptions and release sequence.
- [x] 2026-09-29: Expand implementation details, testing matrix, release gates and deferred admin scope.
- [x] 2026-09-29: Complete source/browser design audit; 15 findings in docs/UI-UX-AUDIT.md. No implementation fixes yet.
- [x] M1: Import and assess the design source; resolve mapping and numerical-content decisions.
- [x] M2: Build a faithful marketing and intake preview.
- [ ] M3: Integrate durable intake, call and partner submissions and follow-up operations.
- [ ] M3A: Implement owner login, authorized inbox/detail, persisted statuses and audit trail.
- [ ] M4: Verify behavior, visual fidelity, accessibility and failure recovery; review preview.
- [ ] M5: Publish approved replacement, smoke-test and update design artifacts.

## Audit inputs


Resolve the applicable findings UX01–UX15 in docs/UI-UX-AUDIT.md during milestones M1–M4. Browser evidence confirms the Under 5 estimate defect, mobile admin column collapse, unnamed email field, inactive keyboard Back action and theme reload mismatch. Each fix needs its listed retest before release.

## Detailed execution supplement


`docs/IMPLEMENTATION-DETAILS.md` specifies the route/state inventory, eight file-level work packages, schema compatibility approach, test matrix, release gates and secure-admin follow-up. The user confirmed secure admin is required in the first release, including a private owner login. The login email is taitgoodwin@gmail.com (user-confirmed). See docs/ADMIN-PLAN.md for the required M3A work.

## Milestone 1 — Establish the source and resolve contracts


Import reviewed tokens, assets, component sources and UI kit reference into `design/current/`, with provenance and checksum; keep old exports untouched. Inspect supplied code before using it and avoid executing the prebuilt bundle merely to inventory it. Map kit components to production `src/ui/` modules and marketing screens to `src/marketing/`. Document exact route mapping: `/`, `/how-it-works`, `/what-we-automate`, `/questions`, `/partners`, `/start`, plus retained `/privacy` and `/designs/`.

Map the new business labels to accepted server inputs or version the schema compatibly. Resolve estimate ranges and caps: the supplied Under 5 calculation can return 4–8 hours, contradicting the stated cap. Decide between transparent illustrative bounded estimates, collecting exact hours, or omitting figures. No inferred numeric policy becomes an approved claim automatically. Review industry citations, partner terms and business promises. Acceptance is an inventory, one shared field contract, and documented decisions for every discrepancy; no runtime changes are required to complete this milestone.

## Milestone 2 — Build the visual preview


Implement the supplied tokens and reusable components in `src/ui/` and styles, then the five marketing screens and intake states. Update `src/App.tsx` routing and `vercel.json` deep-link behavior while retaining `/designs/` and `/privacy`. Convert browser-global references to imports rather than introducing a second React runtime. Add semantic form controls, theme behavior, reduced motion and focus handling. Use the admin kit as the visual reference for the separately built secure dashboard; never reuse its demo credential check.

Use the actual JSX as the visual source, preserving warm paper, rust/petrol accents, specified typography, hours-based figures and intentional proof placeholders. Replace `.co` contact addresses and fake scheduler copy. Show a preview with synthetic data; do not represent local state as saved. Acceptance is route-by-route desktop/mobile screenshots and a clickable journey through intake with valid/invalid states. Run build and verify the operator boundary stays intact.

## Milestone 3 — Connect production behavior


Reuse `api/leads.ts` and `server/leads.ts`, preserving `POST /api/leads` fields: requestId, intent plan/call, email, business, hours, pains, preferences, consent and honeypot website. Success remains saved:true after durable private storage. Extend shared validation only with backward compatibility. Build a separate `api/partners.ts` and partner validator with requestId, name, craft, contribution, email, consent and honeypot; proposed length limits are 120/1000/254 for name/craft/email, with contribution from the four source choices. Add the partner handler to local Vite development. Apply the same origin, body-size, throttling, private-storage and retry protections.

Connect UI pending/error/success states. Keep unchanged retries stable; expose no Blob URL. Manual call requests must state that no appointment is booked. Retain no plan email delivery promise. Establish and test owner follow-up through private-store review or configured notifications. Acceptance is a synthetic saved record for every request type, truthful success and failure states, and an owner-accessible follow-up procedure. Add tests for partner validation/storage failure and meaningful regressions in lead handling and estimate logic.

## Milestone 3A — Secure owner dashboard


Implement the account, authorization, private inbox and transactional status/audit workflow specified in docs/ADMIN-PLAN.md. The user must be able to sign in as the sole initial administrator, inspect real customer and partner requests, and change their status. Public visitors and authenticated non-owners must receive no lead data. This is required before the combined release can pass operational readiness.

## Milestone 4 — Validate and review


From the repository root, with Node 24, run `npm ci` when installing a fresh clone, `npm test`, `npm run build`, then `npm run dev`. Build runs boundary checking and TypeScript. Local integration needs server-only Blob configuration in ignored `.env.local`; do not print it. Vite serves the current lead endpoint; after M3 it must also serve partners. Without storage configuration, a submission should fail closed, not pretend to save.

In the browser, test all page links, deep-link refresh and Back; test invalid and valid intake; test preserved answers on step navigation, duplicate clicks, timeout, 429 and storage failure; test call and partner acknowledgement; verify actual stored synthetic records privately. Check at 320px, 390px and desktop widths, both themes, keyboard operation, contrast and reduced motion. Validate every nonempty pain subset across all bands; Under 5 with all pains must not claim eight recovered hours. Test annual conversion consistency if those figures remain. Record screenshots and command summaries against requirement IDs in `docs/verification.md` with pass/fail, commit and date; this file is created during execution.

Acceptance is R01–R14 covered by evidence or explicit scoped decisions. Eight existing tests passed at the prior gallery release; do not claim a future test count before running it. Present the preview for the user's visual review before homepage replacement, consistent with the agreed plan.

## Milestone 5 — Release and recover


Publish the reviewed commit using the linked Vercel project. Record current production deployment as rollback target before promotion. Merge the corresponding source so future deployments include the change. Verify HTTPS, homepage, privacy and deep links publicly; submit identified synthetic plan/call/partner requests and inspect only their private records. Check the chosen owner notification/review path. Update Figma and the labeled public design gallery to this source; preserve historical designs as archives.

If route loading, durable submission, privacy or truthful confirmations fail, restore the known-good deployment and investigate before accepting traffic. Rollback must preserve all stored leads and avoid destructive schema changes. Acceptance is a live verified site, a release record with commit/deployment/rollback IDs and known limitations, and updated design artifacts. The previous 30-minute launch target is not an estimate for this expanded migration; reassess duration after M1.

## Idempotence and recovery


Keep source import additive and checksum-verified. Work on a dedicated branch and preserve existing changes. Repeat tests freely using synthetic data. Retries of unchanged submissions must reuse the existing ID and content; do not globally delete test-shaped or real records. Keep old endpoints compatible through rollout. Reverting frontend deployment does not undo stored submissions, so investigate and reconcile any partial operational failure independently.

## Surprises & Discoveries


The supplied UI kit is newer than the four archived boards. The kit's contact domain is .co, whereas the user selected .com. Its business categories and numeric ranges differ from current server validation/domain data. Marketing README says nine FAQ questions while screen copy says seven; count the actual items and correct the label. The intake README asserts an hours cap, but code uses `Math.min(sumHi, cap + 4)` with Under 5 cap 4. Partner submission only sets local sent state. Admin uses printed demo credentials and seeded memory rows. These are concrete integration defects or discrepancies, not proof that backend functions already exist.

## Decision Log


2026-09-29, user: the uploaded ZIP is the design reference, superseding the earlier boards. 2026-09-29, planning assumption: manual email-based call requests remain the initial release path; no scheduler selected. 2026-09-29, user update: secure admin with a private owner login is required for first release; this supersedes its earlier deferral. AI drafting remains deferred. 2026-09-29, user request: document workflows and requirements during plan phase. 2026-09-29, plan: proposed partner API is separate from the existing intake schema. These assumptions are revisable and must be updated when the user changes scope.

2026-09-29, user: taitgoodwin@gmail.com is the owner/admin login; hello@levarum.com remains the public contact. No account has been created during planning.

## Outcomes & Retrospective


Planning documents now describe scope, workflows, interfaces, failure paths and evidence required to ship. The new design has not been implemented, imported into Figma or deployed. Remaining business decisions are estimate policy, claim verification, retention wording and owner follow-up operations; authentication setup now blocks the combined first release; calendar provider choice does not block manual scheduling. The next execution step is milestone 1, once implementation is the active task.

## Implementation checkpoint — 2026-09-29

The existing unfinished work was preserved and completed through a hosted visual-review preview. Public routes, separate admin entry, local API routing, private Blob partner storage, immutable retries and responsive fixes are implemented. Build, API/security and browser evidence is in [verification](docs/verification.md); provider and follow-up operations are in [operations](docs/OPERATIONS.md). The qualitative plan deliberately omits personalized numeric savings. Historical source snapshots remain unchanged.

M3 public storage verification passed for synthetic plan/call/partner records locally and hosted, including anonymous-read denial. M3A implementation exists but provider setup is blocked at the owner's Clerk/Neon terms acceptance. M4 public checks passed; populated admin/provider/concurrency checks remain unverified. M5 has not started: production is unchanged, pending visual review and the remaining operational gates.

Discovery: npm was absent from shell PATH; the existing bundled Node 24.19.0 and npm were used. The initial build and eight baseline tests passed. Browser verification found and fixed the long Home badge's 320px overflow. Real saves, content-addressed retry identity and receipt-time immutability were verified without enumerating customer records. Git shell credentials remain unavailable; the connected GitHub account has write access.

Provider decision: Clerk Hobby and Neon Free were selected for development/preview. Both marketplace commands returned integration_terms_acceptance_required and created no usable configured service. Owner action is required only for that provider step and later identity verification. No paid plan was selected.
