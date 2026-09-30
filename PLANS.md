# Levarum UX correction and preview delivery

Current execution baseline: 2026-09-30. The user approved implementation and explicitly authorized changing design and flow wherever it improves clarity and reduces effort for users/operator. Requirements, user journeys and UI decisions are coordinated across senior business-analysis, UX and engineering agent roles. This is a project execution record; OpenAI’s archived ExecPlans article is an optional recipe, not a mandatory standard.

The [exact previous migration plan](docs/archive/2026-09-30-pre-redesign/PLANS.md) preserves all historical progress, discoveries, decisions and evidence. Its stale milestones and provider-blocked statements are superseded below. [Current requirements](docs/REQUIREMENTS.md), [journeys](docs/WORKFLOWS.md), [design traceability](docs/UX-REDESIGN.md), [verification](docs/verification.md) and [operations](docs/OPERATIONS.md) are the working handoff.

## Purpose and constraints

Help a business owner understand the service, get useful starting points without surrendering contact details, and optionally request a human reply or call. Help partners express interest and the owner reliably review/respond. Use one coherent warm design system with clear task-specific interfaces. Preserve unfinished source work, stored records, endpoint compatibility and immutable owner authorization. Manual email scheduling remains the default; no automated delivery or confirmed booking is implied.

Production remains the earlier pilot. Source work, PR updates and preview deployment are authorized. Select routine decisions autonomously, but provide a tested preview for owner visual review before production replacement. Production authentication/resource/recovery and remaining security probes are independent release gates.

## Progress

- [x] Preserve and inspect existing implementation and historical design provenance.
- [x] Establish current working preview baseline: separate public/admin entries; consented plan/call/partner private saves; Clerk verified owner; Neon index/status/history; isolated preview Blob.
- [x] Record baseline build/typecheck, public/owner browser checks and cloud persistence/reconciliation/concurrency. See dated verification for exact scope; these do not verify redesigned UI.
- [x] Coordinate BA/UX/engineering review; reconcile stale requirements, workflows, admin interfaces and provider status; archive previous documentation.
- [x] Evaluate two intake structures; select guidance before optional contact. No public API change is needed.
- [x] Create Figma wireframes, compare three logo directions, select Lift, and construct editable prototype reference frames. Agent design review is complete enough to implement; owner visual approval remains pending.
- [x] Expand meaningful API tests to 21 passing tests, including direct call without prior plan, explicit consent, delayed durable acknowledgement and purpose-separated deduplication.
- [x] Implement shared design/copy/navigation, ungated task-specific guidance, optional purpose-specific contact and clearer owner labels; authenticated redesigned admin still needs a fresh owner session.
- [x] Run fresh build/typecheck/boundary and 21 API/security tests; local/hosted 72-check public suites, targeted keyboard/failure/consent flows and exact synthetic storage/concurrency checks pass. Hosted missing/fabricated admin token 401/no-store, disabled draft 404 and reduced-motion visibility pass. Accessibility/comparison limitations recorded.
- [ ] Complete redesigned authenticated owner browser checks, live negative-session probes and incomplete manual accessibility checks.
- [x] Save application source commit `700a85075152c2c8411609b5de30738376619560` and deploy review preview `dpl_Vkpo5Y2hLJFrHf9zNz5QZp3zDshW`.
- [ ] Finish source/PR evidence synchronization and give the review report; documentation evidence updates follow the application commit.
- [ ] Obtain visual review; close production identity/resources/recovery/manual-review and remaining authorization gates before replacing the homepage.

## Design references and decisions

Current source: [Levarum UX redesign](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L). Use native editable components/variables/layout, not a screenshot as the only specification.

- Wireframe comparison page `2:51`: choice B, questionnaire → useful guidance → optional contact → saved receipt. The alternatives and reasoning are in UX-REDESIGN.md.
- Logo comparison page `2:52`: three directions considered; selected Lift component `4:2`. Warm approachable direction retained, with a clearer scalable brand mark.
- Prototype Home desktop `6:2`, Home mobile `6:46`, Questionnaire `6:88`, Guidance `6:112`, Contact `6:137`, Receipt `6:159`, Owner inbox `6:173`.
- Supporting frames: dark Home `8:43`, How `10:48`, FAQ `10:66`, Partners `10:82`, owner detail `10:102`, automation examples `10:125`.
- Comparison limitation: editable reviewed reference is not pixel-perfect across the application; desktop two-column hero, five task cards versus three in an earlier draft and native form styling differ. Owner visual review remains open.

These are autonomous project choices under the user’s broad redesign authorization, not claims that OpenAI/Figma prescribes this logo or funnel. Conversion/comprehension improvements remain hypotheses until real users are observed. Selection of a design for implementation is not production visual approval.

## Implementation and acceptance

Keep routes and server schemas backward-compatible. Local questionnaire/guidance never saves a lead. Optional email follow-up uses existing intent plan; call uses intent call. Both require explicit unchecked consent and saved:true before acknowledgement. Switching purpose must reflect matching copy and fresh consent. Preserve retained values, stable unchanged retry identity, pending locks and truthful failure/success states. Print useful guidance without contact controls.

Use task-specific recommendations and human-review boundaries; remove unsupported numerical savings, invented proof and arbitrary first-task ranking. Use compact accessible mobile navigation, consistent public controls and operationally clear admin labels/status messages. Preserve public/admin import separation and every server authorization check. No destructive database migration is required.

Final verification covers routes/Back/refresh; questionnaire validation/edit/no-save behavior; both follow-up purposes; consent/error/retry/pending/receipts; partner save; owner filters/details/status/sync/logout; four viewport widths and both themes; keyboard/focus/contrast/reduced motion; real synthetic persistence and relevant concurrency. Actual screen-reader and representative-user tests must be distinguished from automation and reported unverified if not performed. Update the traceability matrix using evidence from the final preview, not inferred passes.

## Discoveries and role review

**BA observation:** current documents incorrectly described provisioned services and deployed endpoints as proposals. Exact historical copies are retained; current requirements map need → journey → screen/state → API → acceptance → status. **BA hypothesis:** separating exploration from contact better matches the user’s intent; lead quality/volume impact is unknown.

**UX observation:** seven intake states and surprise email gate conflict with a simple-question promise; generic repeated advice and catalog-first ranking overstate relevance; hypothetical Home hours conflict with qualitative recommendations; mobile header, metaphorical copy and raw operator labels obscure tasks. **UX decision:** choose ungated useful advice, clear terminology, compact navigation, shared design foundations and the Lift mark. These are reviewed design judgments, not measured user preferences.

**Engineering observation:** no API schema change is necessary; server already supports direct call requests and durable consented saves. Owner authorization and transactional index/history can be preserved. **Engineering evidence:** 21 tests/build/typecheck/boundary pass; local and hosted public suites each pass 72 responsive/theme checks plus guidance-before-contact, purpose-consent reset, injected failure/retry, receipts and keyboard interactions. Three exact hosted synthetic private saves and concurrent stale-version/idempotence checks pass. Redesigned authenticated owner UI still needs a fresh session. Per-instance throttling, manual correspondence and outstanding production/session probes remain documented limitations.

## Recovery and release

Keep original ZIP snapshot and old design gallery archival. Preserve all current uncommitted work. Use synthetic data only for test records; do not enumerate unrelated customer records or publish credentials. Preview uses isolated storage/development identity. Source rollback changes code, never deletes stored leads or index/history. Before production promotion, record the known-good deployment, complete the production gates and inspect actual release routes and identified synthetic saves.

## Outcomes

Application commit `700a85075152c2c8411609b5de30738376619560` (tree `5743424959207b8db3741825528c7841c715e4ca`) is deployed at the [current redesign preview](https://levarum-6n8z4iohc-mind-lever-gmail.vercel.app), deployment `dpl_Vkpo5Y2hLJFrHf9zNz5QZp3zDshW`. Public journeys and targeted persistence/concurrency checks passed as detailed in [verification](docs/verification.md#ux-redesign-verification--2026-09-30); this is not full requirement closure or production acceptance. Current source review PR is [#4](https://github.com/taitgoodwin-gmail/Levarum/pull/4). Authenticated redesigned admin, manual accessibility/provider contrast review, real-user testing, visual approval and production operational/security gates remain explicit. Production is unchanged.
