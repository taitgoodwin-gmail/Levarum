# Levarum autonomous design-to-launch plan

Created 2026-09-30. Execution status: active; tested preview delivered, design and production gates remain open. This is a project execution plan, not a claim that the app has switched collaboration modes.

## Objective and completion

Reimagine Levarum using Figma guidance, Google web.dev/Lighthouse and W3C accessibility criteria; implement the selected experience; publish a tested Vercel preview with editable Figma, committed source, updated PR and evidence. Prepare the production release and promote only after the owner's visual approval and production readiness gates. The preview milestone and production milestone are distinct. A preview alone does not complete a goal that includes production launch.

Preserve existing source, historical designs, unfinished work and stored records. Keep current routes compatible or specify redirects. Retain consent, truthful durable-save acknowledgements, stable retries, private storage, immutable owner authorization and separate public/admin bundles. Manual Apple/iCloud email and scheduling remain explicit; no invented business facts, proof, fees, integrations or booking confirmations. Do not use GOV.UK as a design authority.

## Operating method

Primary agent coordinates the already authorized BA, UX and engineering agents. BA owns offer/requirements/operational fit; UX owns competing concepts, visual system and journeys; engineering owns contracts, security, performance and implementation feasibility. Agents may read in parallel, but each edited file has one owner. Primary agent resolves disagreements and records reasons; agreement among AI agents is not user research.

Use existing repository and Figma file OWG4WbjbMmMILS4LKHzL6L. Inspect Git status/diff and applicable instructions before edits. Preserve .agents/ and skills-lock.json. No secrets/customer data in screenshots, logs, commits, shared artifacts or public design files. Continue independent work while a login/decision is pending. No paid services, outside messages or destructive service changes without authorization.

## 1. Establish baseline

- Read current requirements, workflows, implementation/admin plans, UX traceability and verification. Map source commit to deployed preview; inventory outstanding checks.
- Run existing tests, typecheck/build and boundary check. Capture current public layouts/states and preserve historical Figma pages.
- Run Lighthouse on the actual application, confirming no protection/login page contaminates public results. Use a fixed Chrome/Lighthouse version and settings; three comparable mobile and desktop homepage runs. Audit key additional routes individually, and use interaction checks for SPA states.
- Save raw reports privately where auth is involved. Publish sanitized summary, settings, median/range and top actionable findings. Field data unavailable means unverified, not pass.
Exit: reproducible baseline and prioritized issues with evidence, affected task, severity, source principle and validation method.

## 2. Clarify the offer and journey

- Describe intended customers, concrete jobs, delivered service, engagement steps, human controls and limitations using only verified business facts.
- Audit competing businesses/sites from public sources to identify conventions and differentiation opportunities; do not copy their branding, claims or layouts.
- Map exploratory prospect, ready-to-contact prospect, partner and owner journeys through navigation, input, failure, recovery and confirmation.
- Trace each required field to displayed value or operational need. Compare immediate task selection with existing questionnaire; avoid collecting unused context before guidance.
- Maintain a direct discussion path. Preserve existing API schema where possible; specify any additive compatibility change and tests before coding. Never invent answers to satisfy an API.
Exit: offer brief, content outline, field rationale and updated requirement-to-journey matrix. Unresolved business facts remain explicit omissions/questions.

## 3. Explore and select design

- Create two substantially different editable Figma concepts: an example-led editorial site and an interactive task-exploration site. Include real copy, mobile/desktop, one complete representative flow and an owner workspace view.
- Explore three logo treatments in context: refined Lift, wordmark-led and connected-work symbol. Test favicon, small header, both themes and monochrome.
- Use native text/vectors, Auto Layout, shared components/variables and named states. Preserve previous frames on labeled historical pages.
- Score concepts qualitatively against offer clarity, distinctive character, task effort, usefulness, accessibility, operator fit and performance cost. Record weaknesses and disagreements; scores are review judgments, not measured user outcomes.
- Select the best-supported direction autonomously for preview implementation. Present alternatives and rationale; owner visual approval is still required for production. No extra blocking concept approval is required for reversible prototype work.
Exit: selected concept with source-linked rationale, responsive frames and inspected screenshots; alternatives retained.

## 4. Complete prototype and specification

- Define typography, grid/spacing, colors in both themes, icon/wordmark rules and interaction/motion behavior. Use animation only when explanatory and provide reduced-motion equivalents.
- Connect public exploration, guidance, contact, partner and receipt paths. Include validation, pending, failure/retry, back/edit, refresh behavior and truthful next steps.
- Specify owner list/filter/detail/status/sync, loading, empty, error, conflict, denied/session-expiry/logout states. Prioritize scanning and action over decorative consistency.
- Map Figma components to existing code; record any intended differences. Avoid pretending static Figma input illustrations are functional API tests.
Exit: complete handoff with every changed requirement mapped to frame/state, contract, implementation location and acceptance scenario.

## 5. Implement

- Implement shared foundations and public shell first, then offer/example content, exploration/contact/partner flows, then operational admin refinements.
- Keep no-save exploration, private consented submissions and unchanged retry semantics. Do not introduce backend scope solely to support visual decoration.
- Preserve private data boundaries, server-side owner/session checks and transactional status updates. Inspect dependencies before adding any; use existing tools where practical.
- Add meaningful tests only for new behavior or regression risks. Update documentation with actual contracts and recovery behavior.
Exit: production build/typecheck/boundary and relevant tests pass; no placeholder content or broken core routes.

## 6. Verify and correct

- Check routes, direct loading, Back, refresh, link destinations, menu and FAQs at 320/390/768/1440 widths in both themes; inspect typography, overflow and long content.
- Verify keyboard operation, focus progression/restoration, labels and announcements, contrast, zoom/reflow, reduced motion and theme persistence. Run automated accessibility tools plus manual checks; conduct screen-reader checks only with available real tooling and report exact scope.
- Exercise invalid input, fresh consent on purpose change, pending lock, injected failure, retained input, duplicate retry and truthful receipt. Use clearly synthetic records for real saves and exact private readback.
- Verify admin anonymous/fabricated/expired/non-owner denial as feasible, owner inbox/details/filter/status/conflict/persistence/sync/session/logout. Ask for owner login only when needed, never credentials in chat. Never weaken auth to automate a test.
- Compare concurrent synthetic updates, stale409 and idempotent status retry. Avoid enumerating customer records.
- Repeat Lighthouse under baseline conditions. Project target: mobile homepage median performance >=90, investigate any regression and document any unmet target. Resolve actionable accessibility defects independently of aggregate scores. Field CWV targets: LCP<=2.5s, INP<=200ms, CLS<=0.1 at p75 by device class; these cannot be certified from Lighthouse navigation runs.
- Compare final screenshots to corresponding Figma frames; correct discrepancies or document intentional differences. Representative-user testing remains unverified unless actual sessions occur; prepare neutral tasks without inventing participants/results.
Exit: evidence matrix separates passed, failed, untested and blocked. Core public flow/security failures prevent release; remaining limitations are explicit.

## 7. Save and launch preview

- Inspect staged diff for accidental files/secrets. Commit application and evidence; push via authenticated GitHub connector if shell credentials remain unavailable.
- Update and attach existing PR #4 with final scope, Figma, tests, risks and production gates.
- Deploy Vercel preview; verify intended application routes and synthetic persistence on that exact deployment. Repeat affected smoke checks after deployment-specific fixes.
- Deliver concise report, protected preview URL, Figma links, screenshots, Lighthouse comparison, commit/deployment identifiers and unresolved gates. Do not claim preview results for another commit.
Exit: working hosted preview and reviewable source/design/evidence bundle. No production replacement yet.

## 8. Production readiness and promotion

- Prepare production Clerk/domain configuration, isolated database/storage environment, correct secrets and server owner binding. Confirm intended resource/account context before changes; do not purchase paid plans automatically.
- Verify owner access/recovery, backup/restore capability, appropriate live authorization/session probes and operational review/retention procedures. Record limitations that cannot be independently demonstrated.
- Document known-good deployment and rollback procedure; code rollback must not delete stored submissions. Configure supported public metadata/canonical/indexing appropriately; keep private admin out of indexing.
- Obtain owner's visual approval for the concrete preview and resolve required account/paid/operational decisions. Earlier instruction explicitly reserves this approval; silence is not approval.
- Promote approved tested deployment to production only after gates close. Smoke-test levarum.com public routes, a synthetic saved request and authorized owner visibility as available; roll back code if a critical regression occurs.
Exit: approved production deployment is reachable and verified, with evidence and recovery instructions. Only then mark the full launch goal complete.

## Escalation and limits

Autonomous: research, design alternatives, copy grounded in facts, implementation, tests, synthetic records, Git/PR, previews, release preparation and routine reversible decisions. User required: inaccessible account login/verification, paid commitments, real-business facts needed for truthful claims, owner visual approval, and operational commitments only the owner can make. Research participation and outside communications need authorization. Unavailable real-user/field evidence is reported honestly; do not fabricate it or equate it to automated checks.

When blocked, state the precise unresolved gate and continue unrelated authorized work. No repeated unchanged polling or repeated permission requests. Keep milestone updates and a dated decision/evidence log. No deadline or performance uplift is promised without supporting evidence.

## Milestones

- [x] Comprehensive execution plan saved.
- [x] Baseline and current gaps established.
- [x] Offer, journeys and field rationale synchronized.
- [ ] Figma alternatives and selected direction complete.
- [ ] Full prototype/specification complete.
- [x] Application implemented and locally verified.
- [x] Tested Vercel preview, PR and evidence delivered.
- [ ] Production readiness and owner visual approval complete.
- [ ] Production promotion, smoke checks and launch handoff complete.

Milestone evidence as of 2026-09-30: current application source6b9a0f7 and the tested post-scope preview84663f5 are recorded in verification.md; documentation-only commitbfa506e also deployed successfully. Wordmark and failed-submission focus fixes are deployed. Local SQL recovery and selected-record cloud Blob recovery have passed their separate scopes; combined target-only application restoration also passed for three matching synthetic records/two events, as recorded in RECOVERY-PLAN.md. Completed preview milestones do not imply full prototype, owner session, production or visual approval completion.
