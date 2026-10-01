# Levarum design-to-launch execution record

## Active checkpoint — provisional Round2 cloud implementation, 2026-10-01

The owner has requested a stronger modern design, including movement, modern colors and layout. Preserve this functional checkpoint while a new Figma direction is reviewed; do not treat Round2 as final visual approval.

- Latest PR4 tip9e65a576 was cloned cleanly; its parent72f01fd is retained. Initial33 tests/typecheck/build passed before application edits. Work proceeds on a separate review branch; PR4 and production are not overwritten.
- Implemented latest page08 Home/Contact Figma refinement, exact joined-L asset, service-first action hierarchy, real static examples, simpler contact and truthful receipts. Kept the legacy task routes and all private/partner/backend contracts. [Current implementation record](docs/UX-ROUND-2-IMPLEMENTATION.md) records differences and limits.
- Current33 backend tests, TypeScript/build and public/private import boundaries pass. Exact-commit CI on2d7c600 passes all four public browser suites:80 responsive cases,8 keyboard recoveries,10 failure/retries,16 max-content forms and25 zero-violation Axe scans. Screenshots were inspected. A separate credential-free admin harness mismatch is corrected without changing auth; aggregate rerun remains to be checked. Protected preview access does not yet allow hosted interaction QA. See the implementation record for exact run/artifact links.
- Authenticated owner/production identity/recovery/operating commitments and final visual review remain release gates. Root coordinates production promotion only after those checks.


Updated 2026-09-30. The active objective is [AUTONOMOUS-LAUNCH-PLAN.md](docs/AUTONOMOUS-LAUNCH-PLAN.md), including production launch after the reserved owner visual approval and service/security gates. This file is a project convention; OpenAI’s archived ExecPlans recipe is optional guidance.

The [previous record](docs/archive/2026-09-30-before-evidence-sync/PLANS.md) is preserved verbatim as historical evidence. Its old questionnaire, no-API-change, earlier-preview and pending-redeployment statements are superseded here. Paths inside that archived copy are relative to its original repository-root location.

The current tested preview is application commit `d3c0a824` at [release preview](https://levarum-epjcu3fu0-mind-lever-gmail.vercel.app). Earlier persistence/performance evidence retains its original source/deployment scope; see docs/PUBLIC-RELEASE-CHECKS.md and docs/README.md.

## Task-first application checkpoint — historical source 8989

- Source `8989c1c0d6853c608baf3c424edd34e9a99fe334`, tree `0252f14aab8690f0f2b56dc982f3ebb0703fca61`, is deployed at [the tested preview](https://levarum-k09ohnt2g-mind-lever-gmail.vercel.app), deployment `dpl_DF4zfACeg4HahJwDZ6CWAa3gG5Tr`. [PR4](https://github.com/taitgoodwin-gmail/Levarum/pull/4) remains draft. Production is unchanged.
- Immediate task exploration requires no questionnaire or email. A ready visitor can use /contact directly. Email/call/partner requests require explicit consent and acknowledge only durable private saving. Scheduling and correspondence remain manual.
- [Lead v2](docs/LEAD-V2-CONTRACT.md) was specified before implementation. Genuine optional context and free-text messages replace invented defaults; unversioned legacy validation, canonical bytes and hashes remain compatible.
- 32 API/security tests, typecheck/build and public/admin boundary checks pass. Local and hosted public suites each passed80 route/width/theme cases plus consent, errors, pending controls, retries and receipts. Three exact synthetic private records verified v2/privacy version/no invented context and transactional concurrent status behavior. [Verification](docs/verification.md) defines the exact scope; it does not prove redesigned authenticated owner operation.
- Separate Axe scans reported zero violations on8 public routes in both themes. Automated results are not WCAG conformance or actual screen-reader testing. [Design QA](docs/REIMAGINATION-DESIGN-QA.md) records further scoped keyboard, reflow and reduced-motion checks.
- [Performance evidence](docs/PERFORMANCE-BASELINE.md) separates the frozen local baseline, local candidate and exact hosted checks. Lab scores do not prove field Core Web Vitals or a causal performance improvement.

## Current design decisions

[Editable Figma](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L) retains historical sources. Concepts16:3/16:4 are editorial;16:5/16:6 are task-led. Selected direction combines editorial marketing with immediate exploration. Page18:2 specifies task/contact/recovery/operator states; remaining gaps and subsequent refinements belong in design QA. The concept frames are not blanket pixel-parity evidence.

[Three refined logo directions](docs/BRAND-REFINEMENT.md) now have native component variants and header/mobile/favicon/monochrome contexts. Wordmark-first is the current expert recommendation; the current deployed preview implements Wordmark-first. Owner review of concrete visual alternatives remains open.

Use Figma, Google/web.dev/Lighthouse and W3C guidance; no GOV.UK authority. Product decisions and untested hypotheses remain identified. AI-assisted BA/UX/engineering walkthroughs are not research with representative users.

## Keyboard recovery follow-up — historical local checkpoint

2026-09-30: manual keyboard review found focus fell to document.body after failed async saves. Shared SubmissionError now focuses the alert, with retry next in keyboard order, on contact and partner forms. Validation preserves pre-existing help-text descriptions.32 tests/build/boundary and the80-case local public suite pass after this change; dedicated repeated-failure coverage is tracked in verification before saving/deploying. At that checkpoint these local changes were not claimed for the hosted 8989 preview. The later wordmark checkpoint below records their verified deployment on 8e80/9tv; retain the earlier statement only as chronology.

The UX agent owns core public Figma state completion on page18:2. Engineering owns hosted performance evidence. Root coordinates implementation, brand and launch gates. No concurrent ownership of edited files; keep .agents/, skills-lock.json, original ZIP and unfinished work intact.

## Remaining release work

1. Design selection and specification handoff are complete (QA7), with intentional prototype differences recorded. Remaining visual acceptance is the owner’s explicit production review; authenticated operator rendering is verified after login.
2. Finish current authenticated owner walkthrough and live denied/expired/revoked checks using synthetic records. Owner sign-in request is pending; never extract credentials or weaken authorization.
3. Correct any reproducible accessibility defects, document real AT/zoom/representative-user limitations, and verify the exact final preview after changes.
4. Save/push source and evidence; update attached PR and preview report. Deployment-specific results belong to their exact commit/deployment.
5. Close production Clerk/domain/origin/immutable-owner, separate resource scopes, backup/restore/recovery, manual review/privacy operations and rollback gates. Verify configuration without printing secrets or enumerating customer records. No paid commitment is authorized implicitly.
6. Obtain explicit visual approval of the concrete tested preview. Promote only after required gates close, then verify levarum.com and a synthetic saved record. Code rollback must preserve records.

The full goal remains active. Preview delivery alone is not completion.


## Historical checkpoint — wordmark preview

Source8e80f5d is automatically deployed by Vercel Git integration at [9tv preview](https://levarum-9tvocbmhj-mind-lever-gmail.vercel.app), deploymentdpl_5oxtDaZnuyTp9iBceQjos1i1R7mP. Wordmark-first is implemented in public/admin layouts with matching favicon and legacy compatibility.32tests/build/boundary,80local+hosted checks,8hosted repeated-failure cases and8live absent/fabricated admin denials pass. Actual owner access, new source private-record readback and a new Lighthouse run are not claimed. Existing8989 API/storage/performance evidence remains intact.

Figma contact/explorer and shell/partner/operator state refinements are indexed in design QA. Code Connect was actually queried and requires a paid eligible Figma seat; the source map is documented without introducing a launch dependency or payment.

The owner explicitly approved the isolated Neon production connection, and it succeeded. Production-only resource/variable scopes and distinct preview/production Neon projects/endpoints are verified. Exact application DDL initializes idempotently; a synthetic status/event transaction verified defaults, row locking, update and mutation uniqueness, then rolled back with no retained test rows. This is not an authenticated production API/concurrency or backup/restore test. The earlier approval rejection is resolved, not a pending gate. Existing pilot and production Blob remain unchanged. Clerk production provisioning and actual identity/recovery gates remain open; see [provisioning evidence](docs/PRODUCTION-PROVISIONING.md). [Production release gates](docs/PRODUCTION-RELEASE-GATES.md) records the inspected pilot rollback candidate and environment names/scopes.


## Current checkpoint — isolated preview storage

Application source6b9a0f7 fails closed when non-production lacks its dedicated Blob credential.33 tests, build/typecheck/boundary and80 hosted responsive checks pass. Exact synthetic readback/concurrency/idempotence and eight baseline-matched Lighthouse runs pass; Home median mobile98/desktop100. Documentation commit84663f5 triggered a fresh post-scope deployment; bounded real saves/retry/private readback/concurrency passed there using preview-only credentials. Provider and local Blob scopes are corrected; old deployments are not claimed revoked.

Clerk DNS and certificates are verified. The separate production Clerk connection awaits action-time approval; immutable production owner enrollment/binding and authenticated journeys remain incomplete. Neon production connection is already approved and complete. Recovery execution status belongs in [RECOVERY-PLAN.md](docs/RECOVERY-PLAN.md); owner operating commitments and visual approval remain open.

Local SQL recovery now passes: official-checksum PostgreSQL18.4 tools exported/restored an actual custom archive preserving three synthetic index records, three status events, original dates, constraints and mutation IDs. Actual storage logic retained retry idempotence and stale-version conflicts after restore. No cloud/Blob/customer access occurred; full recovery remains open.

Cloud Blob recovery and a combined application drill now pass for the same three known synthetic records/two SQL history events: rawbytes/paths are preserved, unsigned reads denied, and restored localSQL plus separateprivateBlob supports actual detail reads/reconciliation without changing original receipt dates/status/history. Target status retries/conflicts pass. No cloudSQL writes/customer reads; production restore and ongoing backup operation remain unverified. See RECOVERY-PLAN.md for exact scope.

## Public release follow-up — hosted d3c0a824

After source599d2f2, actual browser checks found raw network/JSON errors and a low-contrast dark-theme print heading. Shared submission copy and print-only styles now correct those failures; public route metadata supplies canonical URLs/descriptions and unknown-route noindex.33 tests/build/typecheck/boundary and the bounded release browser suite pass. The suite covers eight routes, unknown-route recovery, contextual Back/refresh, both print themes and eight offline/real-timeout/429/malformed-response cases with unchanged-ID mocked retries. No API/private-source changes. The same bounded suite now passes on d3c0a824 at https://levarum-epjcu3fu0-mind-lever-gmail.vercel.app (dpl_Edn1UoLYzYPdNZpf2d9PzAaXVtD3). No real submissions were made in this follow-up. See PUBLIC-RELEASE-CHECKS.md and the launch acceptance matrix for exact scope.

Figma QA6 connects103 public frames with1653 verified navigation reactions and no invalid targets across desktop-light/mobile-dark cohorts. Static forms, selected-cohort coverage, Present-mode behavior and remaining visual differences stay explicitly limited in REIMAGINATION-DESIGN-QA.md. This does not substitute for owner visual approval or live application tests.

## Design and operational closeout

QA7 completes stages3/4: matching hosted Home1440light/390dark comparison, actual menu/favicon/monochrome inspection and requirements→frames→code→acceptance mapping. Prototype forms and Present-mode behavior retain explicit limits. Public navigation/long-content/header checks and live anonymous/fabricated admin denials pass on d3c0a824. The operations runbook includes a tested localhost exact-record deletion procedure and copy/backup-custody handling; no cloud deletion or owner retention commitment is claimed.

## Owner review — reopen design

The owner states the current UI/UX is not ready. Reopen offer, journey and visual identity rather than advancing production setup as the immediate priority. Existing tests and QA7 document technical/design-artifact consistency only; they do not prove compelling usability or acceptance. Preserve current app and history, perform fresh critical BA/UX review, then present materially revised prototypes before application changes.
