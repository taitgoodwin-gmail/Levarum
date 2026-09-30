# Launch acceptance matrix

Audit date: 2026-09-30. Initial audited HEAD: `599d2f2b7c94512985d96d4e127a9dcc5b01a4a9`; current release-acceptance checkpoint: `d3c0a8243633075fb7b3b3d94bbed99007eedb29`. Read-only reconciliation of the explicit [autonomous plan](AUTONOMOUS-LAUNCH-PLAN.md), [requirements](REQUIREMENTS.md), [journeys](WORKFLOWS.md), [admin acceptance](ADMIN-PLAN.md), [15 original audit findings](UI-UX-AUDIT.md), current design/verification/recovery and release evidence. This audit did not rerun tests or inspect live accounts; it records what the existing evidence actually supports. Only this matrix was added by this audit. Concurrent root corrections to ADMIN-PLAN/OPERATIONS were read before finalization; the metadata/submission-copy follow-up now has local and exact-hosted E9 evidence, without transferring prior whole-suite or performance results.

**The launch goal is incomplete.** A tested preview, implementation and substantial synthetic verification are complete. Production identity, fresh owner operation, operating commitments and visual approval remain; QA7 closes the design/specification handoff. Production still serves the earlier pilot. A preview or documentation-only deployment does not complete production launch.

Status terms: **Done** means the named bounded acceptance has evidence; it does not imply production acceptance. **Incomplete** means explicit work remains. **Weak** means some evidence exists but does not cover the full criterion. **Unverified** means no applicable proof was found. “Autonomous” means executable under existing task authority/access; “owner” means an actual login, approval, paid commitment or business commitment—not another planning approval.

## Evidence ledger and precedence

| Ref | Applicable evidence and exact boundary |
|---|---|
| E1 | [Verification](verification.md), hosted isolation checkpoint: application `6b9a0f7`, preview `levarum-cjhcj1631-mind-lever-gmail.vercel.app`, deployment `dpl_352C2wYRW8uVsbcU5irXd3DJTeBm`; 33 API/security tests, build/TypeScript/boundary, 80 route/width/theme cases and public interactions, real synthetic saves/readback and direct server-function concurrency/retry. Public graph: 15 modules. |
| E2 | [Post-scope checkpoint](verification.md#post-scope-deployment-checkpoint--2026-09-30): commit `84663f563e849a7050801ece2fb859565f968ab9`, [tested preview](https://levarum-msfizuxea-mind-lever-gmail.vercel.app), `dpl_ENBZ1wqd2anRwmnBZNyCqKmNCubH`; application unchanged from E1. After credential-scope correction, three real synthetic request types, same-reference retry, exact private reads and direct storage-function concurrent status/retry passed. No new complete browser/Lighthouse run attributed to this documentation-only commit. |
| E3 | [Wordmark/recovery checkpoint](verification.md#wordmark-and-recovery-preview--2026-09-30): application `8e80f5d`, 9tv preview; eight repeated mocked503 focus/retry cases and eight absent/fabricated credential denials across admin actions. Older authenticated owner checks belong to the pre-redesign implementation, not current owner UI. |
| E4 | [Performance](PERFORMANCE-BASELINE.md), application `6b9a0f7`: eight hosted audits; three Home mobile runs 98/98/98 and desktop100/100/100, Start/Contact mobile98 each, matched earlier settings. Home target median>=90 met. Field p75 CWV/INP unverified. |
| E5 | [Design QA](REIMAGINATION-DESIGN-QA.md), [design/code map](DESIGN-CODE-MAP.md), [concept review](VISUAL-CONCEPT-REVIEW.md): alternatives/wordmark and QA2–QA5 preserved. QA6 adds103 registered reachable frames/overlays and1,653 in-set navigation reactions for selected desktop-light/mobile-dark cohorts; all five tasks, full public routes, shell and outcome references connected. Representative screenshots inspected. Graph reachability is not all-reaction Present testing; fields/outcomes remain synthetic, other viewport/theme combinations and minor visual differences remain. No owner approval/pixel parity claim. |
| E6 | [Provisioning](PRODUCTION-PROVISIONING.md), [Blob isolation](BLOB-ISOLATION.md): production Neon connected/schema-tested; distinct databases/stores and corrected production-only versus preview/development Blob credentials verified, local file corrected. Clerk DNS/certificates issued; production integration connection awaits the recorded action-time approval, production owner binding incomplete. Earlier Neon approval does not authorize that separate Clerk action. |
| E7 | [Recovery](RECOVERY-PLAN.md): real local PostgreSQL18.4 archive restore; selected cloud Blob restore; combined source `bfa506e30c792bd5ac14fb8927257fe5fa721a7f`, three matching synthetic records/two historical events, read-only allowlisted preview SQL extraction, local SQL restore and actual application reads/sync against private recovery Blob. Cluster stopped/temporary credentials removed. No production, full-corpus, Neon restore or ongoing backup operation established. |
| E8 | [Operations](OPERATIONS.md), [release gates](PRODUCTION-RELEASE-GATES.md): manual correspondence/scheduling runbook; prior pilot rollback candidate `dpl_HascaVEdQyPsMz6cwCXLn2fV6vwi`; no executed rollback, owner review cadence, retained-copy routine or verified coordinated deletion operation. |
| E9 | Release acceptance: source `d3c0a8243633075fb7b3b3d94bbed99007eedb29`, Ready [preview](https://levarum-epjcu3fu0-mind-lever-gmail.vercel.app), deployment `dpl_Edn1UoLYzYPdNZpf2d9PzAaXVtD3`. Local and hosted `tests/browser/release-acceptance.mjs` runs exited0; inspected `work/release-hosted/results.json` confirms eight route metadata checks, unknown noindex/recovery, print/PDF, contextual Back/refresh and eight contact/partner failure/retry cases. Hosted real timeouts20.058/20.156s; offline network blocked;429/malformed responses and all successful retries mocked, no records saved.33 tests/build/type/boundary passed before deployment. Metadata is client-rendered; generic initial HTML and intentional preview noindex remain. This is not a new complete80-case, real-storage, owner-session or Lighthouse run. |

Latest explicit evidence supersedes older pending language. Do not relabel one deployment's tests as another's. A newly deployed documentation commit alone needs neither a fabricated full retest nor a claim that new UI was tested.

## Product requirements R01–R14

| ID / journey | Result | Evidence and limitation | Concrete next action / dependency |
|---|---|---|---|
| R01 / W01,W07 — cohesive brand/foundations | **Done for public design handoff; operator rendering pending** | QA7 actual matching-width Home/menu/favicon comparison and selected-brand rationale close finite design tasks. Prototype spacing differences are intentional handoff approximations. | Owner approves concrete preview; verify populated operator rendering after legitimate login. |
| R02 / W01 — clear routes/navigation | **Done in bounded public scope** | E9 metadata/unknown recovery/context Back plus64 rendered-link inventories across four widths/both themes and13 direct destinations passed. Not every duplicate click/history sequence. | Production-domain smoke after approval; no remaining known broken public destination. |
| R03 / W02,W03 — immediate task guidance/direct contact | **Done for tested preview plus local follow-up** | E1/E2 no POST/genuine context/direct v2/draft/consent behavior. E9 verifies locally and on its exact preview contextual Back retains selection, refresh clears it, and print media hides header/footer/contact controls while retaining guidance; A4 PDF generated. | E9 hosted follow-up is complete. Production smoke remains stage8. |
| R04 / W03 — durable truthful save/retry | **Done in bounded hosted scopes** | E1/E2 private real saves/retry; E3 repeated503. E9 offline, real20s timeout,429 and malformed JSON now preserve input/consent, focus error, expose no false success and reuse request ID on successful mocked retry. Initial offline/parser copy defects were fixed before passing rerun. | Commit/deployment and affected hosted acceptance complete; no new real-save claim from mocked E9. Production smoke remains. |
| R05 / W02 — task-specific qualitative advice | **Done for tested preview** | E1/task-first evidence covers meaningful task-specific content and removal of personalized ranking; source guidance defines all five tasks and human checks. No measured usefulness claim. | Autonomous: retain complete five-task copy comparison in final visual pass; no additional questionnaire needed. |
| R06 / W02 — no unsupported numerical returns | **Done for implemented scope** | E1 and current source guidance replace personalized savings and hypothetical hour meters with qualitative advice. Historical records remain historical. | Autonomous: final copy scan after any edits; do not revive estimator tests for a removed feature. |
| R07 / W03,W05 — call request/manual scheduling | **Done publicly; weak operationally** | E1/E2 call receipt says no booking; SQL/app tests restrict Booked to call. No email/calendar delivery claim. Current owner browser workflow still pending. | Autonomous after owner login: verify call detail/action; owner confirms actual manual scheduling practice/mail access. |
| R08 / W04 — working partner interest | **Done in bounded hosted scopes** | E1/E2 real private save and bounds/consent; E3 repeated503; E9 all four additional failures/retries pass locally and on its exact preview. | Hosted acceptance complete; finish final keyboard/visual review within remaining R12 scope. |
| R09 / W05 — retrieve/understand/respond to every type | **Incomplete** | E2 direct storage and E7 combined target reads/sync pass; historical owner walkthrough exists. Current authenticated inbox/detail/filter/sync not verified; no agreed review cadence. | Owner login; then autonomous three-type browser walkthrough with exact synthetic fixtures. Owner confirms reviewer/cadence and hello@levarum.com access. |
| R10 / W03,W04,W06 — consent/privacy truthfulness | **Weak operationally** | Public consent/private saves verified. OPERATIONS now specifies exact-record deletion/copy handling; localhost synthetic rollback, retry, control preservation and exclusion filtering passed. No cloud deletion or real retention commitment. | Owner selects actual retention/custody; before real deletion control concurrent retries/reconciliation using bounded quiescence or tested suppression. |
| R11 / W05 — separate public/private, server auth | **Weak** | E1 boundary/secrets tests; E3 absent/fabricated401/no-store and disabled draft404; immutable ID/email/online session implemented. Fresh valid owner/non-owner/expired/revoked replay not covered. | Autonomous prepare probes; owner legitimate login then run them without weakening auth. Distinguish injected provider tests from live session evidence. |
| R12 / all — responsive/keyboard/AT/themes | **Weak** | E1 four widths/two themes; E3 error focus; earlier separate Axe eight public routes/two themes zero violations. QA reflow/text resize and selected reduced-motion checks pass. Real AT/zoom, current populated admin, manual Clerk contrast and exhaustive clipping remain unverified. | Autonomous: final targeted contrast/long-content/focus/zoom/AT where tooling exists. Owner login unlocks private checks. Report unavailable real AT honestly, not certification. |
| R13 / W03,W06,W07 — deployment/API safeguards | **Done in tested preview/local scopes; incomplete production** | E1/E2 safeguards; E9 local33 tests/build/type/boundary and rendered route metadata. Initial HTML remains generic; this is not server-rendered SEO or production indexing proof. Per-instance throttle limit remains documented. | E9 deployment/rendered metadata verified; inspect remaining production headers/origins and final release smoke/rollback. No unrequested distributed throttle or SSR dependency. |
| R14 / W07 — review/provenance before production | **Incomplete only at reserved owner release approval** | QA7 closes design selection/specification; current source, preview, Figma and evidence are reviewable. | Owner reviews exact candidate; only then gated promotion. |

## Admin acceptance A01–A08

| ID | Result / applicable evidence | Next action / dependency |
|---|---|---|
| A01 — enrollment/sign-in/production recovery | **Incomplete:** preview enrollment historically passed; production DNS/TLS ready E6, but production integration/account binding and recovery incomplete. | Owner action-time Clerk connection permission/login as required; autonomous inspect resulting keys/origins and bind verified production immutable ID; test actual sign-in/recovery route. |
| A02 — anonymous/expired/non-owner direct denial | **Weak:** injected auth and E3 live missing/fabricated denials. | With legitimate test sessions, exercise live expired/non-owner/revoked actions; retain no private data in results. |
| A03 — persistent kinds/reconciliation | **Done at storage layer, weak end-to-end:** E2 all three kinds; E7 matched target-only reconciliation. | Fresh authenticated rendering/filter/detail/reconcile for current UI. |
| A04 — status/history/concurrency/idempotence | **Done at storage layer, weak end-to-end:** E2 concurrent409/replay; E7 restored history and retry/conflict. | Current admin UI pending/failure/stale-refresh states and concurrent authenticated API tests when session available. |
| A05 — logout/Back/revocation | **Weak:** historical owner UI clearing and provider removed-session evidence; no retained JWT replay. | Fresh current UI logout/Back and pre-logout-token replay test using authorized own test session. |
| A06 — readable mobile operational UI | **Incomplete:** anonymous entry/layout and Figma owner states; old populated mobile evidence predates redesign. | Owner session then test populated list/detail/errors/long content at320/390/768/1440, themes and keyboard; manually inspect provider contrast. |
| A07 — bundle/secrets/cache boundaries | **Done for bounded checks:** E1 current33 tests/15-module public graph, E3 private/no-store denials. The concurrently corrected ADMIN-PLAN now records33 tests/15 modules. | Targeted current authenticated responses/cache/Back verification; no broader penetration-test claim. |
| A08 — production/recovery/rollback/operation | **Incomplete:** E6 infrastructure and E7 selected-record recovery materially complete portions. | Finish production auth, accessible ongoing recovery/runbook, known-good rollback validation and owner routine; promotion/smoke afterward. A destructive production restore is not required merely to demonstrate a safe procedure. |

## Original 15 audit fixes — current interpretation

The ZIP findings are historical. Removed interactions are assessed by their current replacement, not obsolete prototype steps. The migration checkpoint cannot be used as current authenticated admin evidence.

| Finding | Current result | Evidence / residual action |
|---|---|---|
| UX01 demo-only admin gate | **Weak / release open** | Replaced by Clerk/server owner/session checks E1/E3; finish A01/A02/A05. |
| UX02 false saving/sending/booking | **Done publicly in bounded scopes** | E1/E2 actual saves/truthful receipts, E3 failures, E9 local offline/timeout429/malformed recovery. Hosted follow-up for changed error copy passed E9. |
| UX03 excessive estimate | **Done by removal** | R05/R06 qualitative advice replaces estimator;31×4 numeric combination tests no longer applicable. |
| UX04 collapsed mobile admin row | **Unverified for current populated UI** | Historical correction and current CSS/Figma insufficient; A06 fresh mobile test. |
| UX05 unnamed email | **Done for public browser scope** | Persistent label/associated invalid/helper state E1/E3; spoken AT remains unverified. |
| UX06 inert keyboard actions | **Done for tested public actions** | Native controls/Back/menu/FAQ keyboard E1; final link/action sweep under R02. |
| UX07 discarded Home choice | **Done by removal** | Home no longer collects a business choice; immediate task context is retained E1. Old “Online shop arrives selected” is historical. |
| UX08 theme desynchronization | **Done in tested preview** | Both theme reload/next-action controls verified E1. |
| UX09 missing consent/privacy | **Done for save behavior; operation weak** | Explicit consent/server enforcement/current contact+notice E1/E2; R10 retention/deletion still open. |
| UX10 unsupported proof/promises | **Done in current copy scope** | Qualitative illustrative examples/manual scheduling; no statistics/customer proof invented. Final copy review after changes. |
| UX11 dead navigation | **Weak; local recovery scope expanded** | E1 canonical routes/skip/unknown recovery; E9 unknown-page recovery and task Back/refresh pass locally and on E9 hosting. Exhaustive link-destination audit remains distinct. |
| UX12 FAQ count | **Done by removing numeric claim** | Current copy avoids mismatched count; original question count not a new launch requirement. |
| UX13 radio keyboard behavior | **Done for current controls** | Native scenario radio ArrowRight verified E1/QA. Removed hours chips need no retained implementation. |
| UX14 admin reliability states | **Weak** | Real status/history/reconcile/concurrency E2/E7; current authenticated states/logout still A03–A06. |
| UX15 errors/focus/form semantics | **Weak overall; bounded public recovery verified** | E3 repeated503 focus/helper association; E9 four distinct failure modes × contact/partner focus, Tab-to-retry, retained input/consent and stable ID pass locally and on E9 hosting. Actual AT and authenticated owner behavior remain unverified. |

## Journey completion

| Journey | Result | Missing acceptance |
|---|---|---|
| W01 service/navigation | **Weak** | Final cohesive visual/link review; user comprehension not measured. |
| W02 explore/print/back | **Done for bounded preview/local scope** | E1 guidance/no-save; E9 selected-task Back/refresh, useful print-media content/control hiding and PDF generation pass locally and on E9 hosting. Exact hosted follow-up passed E9. |
| W03 direct/contextual contact | **Done for bounded hosted public mechanics** | E1/E2 real saves; E9 local offline/timeout429/malformed and stable mocked retry. Full accessibility/production acceptance remains separate. |
| W04 partner | **Done for bounded hosted public mechanics** | E1/E2 real saves, E3 repeated503, E9 additional local failures/retries. Full accessibility/production acceptance remains separate. |
| W05 owner operation | **Incomplete** | Fresh authenticated end-to-end, denial/session/logout and routine. |
| W06 privacy/recovery | **Incomplete** | Combined selected recovery now passes; ongoing custody/export/deletion operation and owner readiness remain. |
| W07 review/release | **Incomplete** | Final reviewable design, explicit visual approval, production promotion and smoke. |

## Plan stages and omitted deliverables

| Stage | Result | Remaining explicit deliverable |
|---|---|---|
| 1 baseline | **Done** | Baseline/current source evidence and fixed-profile performance exist. Field data stays unverified, not a failed baseline. |
| 2 offer/journeys | **Done in documented scope** | Offer/competitor/field review and exact v2 spec exist; factual fees/timing/customer outcomes remain omitted rather than invented. |
| 3 alternatives/selection | **Done for expert selection** | QA7/VISUAL-CONCEPT-REVIEW close alternatives, wordmark rationale, actual header/mobile/favicon/monochrome inspection. Owner production approval remains separate. |
| 4 prototype/specification | **Done as scoped design/specification handoff** | QA7 records matching1440light/390dark Home comparison, intentional prototype differences, field-derivative mapping and requirements→frames→code→acceptance. Public/partner journeys and owner state specifications exist; static forms/Present-mode limits remain explicit. |
| 5 implementation | **Done for current deployed candidate** | E9 changes pass33 tests/build/type/boundary. Preserve unfinished `.agents/` and `skills-lock.json`; d3c0a8 is deployed with affected acceptance checks, without relabeling prior tests. |
| 6 verification | **Incomplete; public gaps narrowed** | E9 resolves local print/contextBack/refresh and offline/timeout429/malformed checks. Hosted follow-up passed; remaining link/manual accessibility, owner/session and Figma comparison remain. Performance target already met at E4 source; no new performance result inferred. |
| 7 save/preview | **Done milestone; final bundle refresh remains** | Current d3c0a8 source committed/deployed with E9 hosted checks; PR#4/preview history recorded. Refresh attached PR/report with final exact candidate, Figma, screenshots, performance and gates after outstanding changes. No need to assert HEAD599 was browser-tested. |
| 8 production | **Incomplete** | Production Clerk connection/verified owner/origins; operational readiness and approval; then promotion + real-domain public/private synthetic smoke + release handoff. This is required to finish the user's full goal. |

## Prioritized autonomous work before waiting on the owner

1. **Design/specification closeout is complete** (QA7): matching width/theme screenshots, selected-brand contexts, intentional differences and requirement mappings are recorded. Owner visual approval and authenticated operator rendering remain separate release checks.
2. **Finish remaining public checks after the completed E9 hosted follow-up** (R02/R04/R08/R12,W02): local print/contextBack/refresh, metadata and eight failure/retry cases now pass. Hosted E9 now passes on d3c0a8. A further64 route/width/theme link inventories,13 destinations,16 maximum-content forms, sitemap/robots/headers and eight live admin-denial cases passed (PUBLIC-RELEASE-CHECKS.md). Remaining manual contrast/zoom/available AT scope stays explicit. Do not keep already-resolved local gaps listed as untested.
3. **Execute the prepared authenticated admin checks after login** (A01–A06): ADMIN-PLAN now links a derived allowlist of three known synthetic IDs/routes and specifies the UI/conflict/expiry/logout-replay cases; preparation made no network calls. Execute immediately when legitimate session access exists; do not weaken account restrictions to automate.
4. **Make operations executable** (A08,W06): OPERATIONS now contains the exact-record procedure and passed local synthetic deletion mechanics. Actual owner custody/destination/cadence decisions and safe real-operation quiescence remain. Existing combined recovery is proof of mechanics, not a recurring routine. Confirm actual Neon Free history entitlement only if relying on it; a paid provider snapshot or production restore is not an automatic extra requirement.
5. **Prepare production release validation** (stage8): rendered public route metadata is locally and hosted verified E9; hosted headers/sitemap/admin no-store and denials now pass; production origins and real-domain smoke remain after identity setup. Verify rollback candidate availability and prepare exact commands/smoke without promotion. Initial generic HTML is a disclosed rendering limitation, not a claim of server-rendered SEO.
6. **Reconcile contradictory documentation and final PR bundle**: use the latest bounded evidence listed above. No new app behavior or service purchase is needed for this cleanup.

## Exact owner-dependent items

- The prepared **production Clerk connection** requires the recorded action-time approval; do not reinterpret approval for the already completed Neon connection as approval for Clerk. After connection, owner production enrollment/email verification and a legitimate fresh session may require direct owner interaction.
- **Visual approval of the concrete final candidate** is explicitly reserved before replacing the homepage.
- **Operating commitments:** confirm hello@levarum.com access, who reviews requests and how often, and actual retention/backup custody practice. These can be consolidated into one practical handoff; no invented service deadline or mandatory paid service.
- Only if access/limits actually require it: provider account verification or a separately explained paid commitment. No paid upgrade is currently established as necessary by this matrix.

Representative-user participation, real-world conversion results and field CWV are not replaceable with AI personas. Report them unverified when unavailable. Their absence alone does not create a certification committee or a new launch blocker beyond actionable defects and the agreed release criteria.

## Documentation inconsistencies to correct separately

These are findings, not edits made by this audit:

- **Resolved during this audit by the root agent:** ADMIN-PLAN A07 now records33 tests/15 modules; A01/A05 distinguish historical owner verification from fresh redesigned checks, and A08 reflects recovery/resource progress. OPERATIONS now links the combined recovery evidence and explains Blob-only rebuild loss. No duplicate edits were made here.
- `verification.md` earlier remaining-work text still says final Lighthouse/logo refinement open; later checkpoints and E4/E5 supersede broad versions of those claims. Retain remaining design comparison, not a false “no current performance” claim.
- **Resolved during the follow-up by the root agent:** PRODUCTION-RELEASE-GATES now describes corrected Blob scopes and the fail-closed nonproduction selector; its obsolete broad-scope/fallback paragraph was corrected.
- **Resolved:** README now identifies selected combined recovery as proven and limits the remaining work to production/ongoing custody/routine and owner readiness.
- Original audit UX07 and prior questionnaire/radio/step language belongs to history; do not apply it literally to the task-first release. Current selected flow and exact v2 contract take precedence.

No launch-complete claim is supported until the approved production deployment, required smoke and usable owner operation are recorded. The remaining work is concrete; preview success should neither be discarded nor expanded into production proof.
