## Connected output clarity — 2026-10-01

The Connected state now exposes the existing synthetic captured-details/draft preview, and mobile human approval is a distinct readable panel. [Implementation, before/after screenshots and verification](OUTPUT-CLARITY-REVIEW.md). This is the current focused refinement; existing launch and authenticated-preview gates remain open.

## Font metric reference — 2026-10-01

Identical intended fonts/CSS produce different measured text advances in local Chromium 151 and CI Chromium 143. Use the pinned CI captures for Figma metrics; preserve natural wrapping. [Cause, controlled receipts and authoritative captures](FONT-METRICS-RECONCILIATION.md). No application layout change.

## Current focused opening — 2026-10-01

The supplied “Make work flow” opening and reversible enquiry illustration are implemented, with subsequent panel clarity/mobile refinements. See [signature implementation and launch decisions](SIGNATURE-OPENING-REVIEW.md). This supersedes the old opening; remaining page content and functional routes are preserved. Working-branch publication and previews are approved; main/production remain excluded.

# Levarum UX redesign — current decisions and traceability

## Intended-font verification — 2026-10-01

[Font/visual review and current gate inventory](FONT-VISUAL-VERIFICATION.md) closes the earlier local font-download limitation: pinned OFL Fontsource packages now serve through Vite; actual rendered Schibsted/Instrument glyphs pass16 width/theme/page cases. All33 tests, build/typecheck/boundaries, seven local browser suites and57 Axe scans pass. Original fallback screenshots remain historical. The linked table distinguishes owner decisions/access from safe local work completed and remaining live/operational checks. No push, PR, merge, deployment or credential/access change. Library copies of selected review artifacts are separately authorized.


## Current design-assessment continuation — 2026-10-01

The separate local branch `codex/design-assessment-fixes-20261001` continues exact checkpoint `be7df2b` and implements Figma123:36–39: coral-ribbon Home, readable mobile diagram, both themes, keyboard examples/FAQs, synthetic worked examples and enquiry-state refinements. [Implementation, Adobe-criteria review and final evidence](DESIGN-ASSESSMENT-FIXES.md) records33 tests, typecheck/build/boundaries, six local browser suites and57 zero-violation Axe scans. Google Fonts are blocked here; screenshot typography uses declared fallbacks. Real AT, hosted/authenticated/live-storage and production checks remain open. No push, PR, merge or deployment;77/100 remains a provisional earlier assessment. This record supersedes the presentation status below, not the preserved backend/security gates.


## Current implementation — 2026-10-01

The latest refined page08 Home/Contact frames are now implemented on the separate cloud review branch. [Round2 implementation](UX-ROUND-2-IMPLEMENTATION.md) records source frames, actual behavior, intentional compatibility, design differences and test limits. The service-first Home→Contact journey is primary; existing task guidance routes remain functional. Earlier task-first and reopened-review records below are preserved chronology. Final concrete preview review remains required before production replacement.


## Owner feedback — design reopened (2026-09-30)

The owner reviewed the current d3c0a824 preview and stated: “The UI/UX needs more work. It's not ready yet.” This supersedes QA7's design-selection/specification closeout as a basis for release readiness. QA7 remains historical evidence of matching artifacts and mechanics, not owner acceptance or proof of design quality. Production replacement is not approved.

Reopen offer clarity, information hierarchy, navigation/action priority, usefulness of exploration, visual identity and mobile composition. Preserve the working storage/auth/consent/retry contracts while evaluating alternatives before application edits. Current independent critique identifies: abstract hero proposition; disproportionate invoice example before service breadth; inconsistent primary-action emphasis; repetition between examples and explorer; and repeated defensive qualifications. These are expert observations/hypotheses to resolve, not representative-user research. The owner clarified that both visual design and journey need work, specifically rejecting interactions with little useful function, such as printing a supposed solution. The selected round2 proposal removes print/save, the invoice simulator and the task-selector funnel; consolidates examples; and simplifies genuine contact. [Round2 content and interaction decisions](UX-ROUND-2-CONTENT.md) specifies the proposal without claiming implementation. The owner requested to see the revised direction in Figma.

Next design acceptance must show a materially improved page/journey, explain what changed and why, and obtain the owner's review. Technical test counts, Figma frame counts and source/prototype agreement do not substitute for that judgment.

Current delivery status and latest evidence are centralized in [README](README.md) and [verification](verification.md). The source8989 checkpoint below is retained as dated journey/contract evidence, not the latest deployment or a claim that later work remains undone.

Current baseline: task-first exploration and direct contact, 2026-09-30. The user permits substantial brand, layout and journey changes to simplify the experience for visitors and operator. Current explorer/contact/v2 source is implemented and verified within the [task-first checkpoint](verification.md#task-first-and-v2-verification--2026-09-30): 32 tests/build/boundary, 80 local/hosted route-width-theme cases, targeted flows and exact synthetic private storage/transaction checks. Source8989c1c0d6853c608baf3c424edd34e9a99fe334 is on the [current preview](https://levarum-k09ohnt2g-mind-lever-gmail.vercel.app). Authenticated owner/manual accessibility, logo refinement/full-state alignment, final hosted performance and production gates remain open. This is coordinated AI-assisted BA/UX/engineering work, not research with representative users.

## Evidence boundaries and preserved history

The [exact previous questionnaire-redesign review](archive/2026-09-30-before-task-first/UX-REDESIGN.md) preserves the earlier nine CX findings, gated/ungated questionnaire comparison, Figma frames and 21-test/72-browser-check evidence. The [original UX01–UX15 source-package audit](UI-UX-AUDIT.md) remains distinct. The [dated verification record](verification.md#ux-redesign-verification--2026-09-30) applies to application commit700a850 and its recorded preview. None of those old passes automatically verifies the new immediate explorer, direct /contact or v2 contract; use the current checkpoint for explicitly repeated tests.

[Performance baseline](PERFORMANCE-BASELINE.md) is a separate frozen local laboratory run of the previous application: Lighthouse13.5.0/Chrome154, Home mobile median92 (92–99), desktop100 (99–100), three runs each. Duplicate font requests are a measured dependency-chain finding to investigate. These are not current hosted/field results or an accessibility certification; repeat comparisons must retain those settings.

## Current findings and coordinated decisions

| ID | Observed evidence | User/operator consequence | Current decision and acceptance |
|---|---|---|---|
| TJ01 / P2 | GUIDANCE is selected solely by pains; business/hours are only echoed/stored. | Two required questions delay content without tailoring it. | Remove the questionnaire; one selected task immediately reveals guidance. Prove no POST/no background field prerequisite. |
| TJ02 / P1 | Previous prominent CTAs always enter /start; a ready visitor’s mailto bypass is buried in Questions. | Someone with a known problem must take an irrelevant journey or leave the stored-request workflow. | Direct /contact visible from main site; genuine message when no task selected; fresh-load/refresh/receipt tested. |
| TJ03 / P1 | Legacy parser requires business/hours/pains even for a call. | Removing fields client-side alone would fail or encourage fake defaults. | Explicit v2 contract permits omitted context; retain exact legacy canonical/hash behavior; compatibility tests before release. |
| TJ04 / P2 | Static task guidance can resemble a generated assessment if surrounded by context questions. | Misstates how the advice is produced. | Explain task-based editorial guidance; no ranking/savings score/personalization claims. All five tasks need content checks. |
| TJ05 / P2 | Previous Figma frames reflect a questionnaire and partly illustrative form layout. | Old screenshots cannot specify the new direct/contact interaction accurately. | Keep old frames archival, new concept/journey links below; browser comparison records differences rather than claiming parity. |

**BA:** [Offer/field review](OFFER-JOURNEY-REVIEW.md) traces every intake/partner field to displayed value or operator use and compares two actual competitor primary sites. Hours has no current decision use and is removed. Business may help a human reply but is optional at contact. No price, SLA, integration certification, geographic capacity or case study is invented.

**UX:** compare service-led editorial Home (A) and interactive exploration-led Home (B). Use service-led explanation for the marketing surface and immediate task interaction for /start. The hypothesis is clearer service positioning with less input effort, not measured conversion improvement. “Explore a task” and “Discuss your work” name the two real user intentions.

**Engineering:** preserve endpoint/kinds/private storage/index/status/auth boundaries; add only explicit numeric schemaVersion 2 for genuine optional context and message. Legacy parser/hash compatibility is a hard regression requirement. [LEAD-V2-CONTRACT.md](LEAD-V2-CONTRACT.md) defines implementation behavior; writing it is not a test pass.

## Current journeys and source-linked design

Explorer: select one task → read what could change/checks/human controls immediately → switch/print or optionally discuss the selected task. No questionnaire, email, consent or save blocks guidance. Contextual ContactRequest remains in memory inside /start, retains the real selected task and permits Back. Direct /contact requires no prior exploration; email plus genuine message and chosen purpose create an intentional request after consent. Optional business remains absent if unspecified; no hours question/default is supplied. Call availability stays optional. Changing task context or purpose resets consent. saved:true precedes receipt, and no appointment or automatic email is implied.

[Figma working file](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L) contains editable alternatives and journey frames:

| Artifact | Native frame reference |
|---|---|
| Concept A, service-led editorial | [Desktop16:3](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=16-3), [mobile16:4](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=16-4) |
| Concept B, interactive exploration | [Desktop16:5](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=16-5), [mobile16:6](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=16-6) |
| Selected journey page | [18:2](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=18-2) |
| Task explorer | [Questions23:33](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=23-33), [invoices 18:3](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=18-3), [copying 23:54](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=23-54), [booking 23:75](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=23-75), [leads 23:96](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=23-96) |
| Contact | [18:4](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=18-4) |
| Outcome and recovery | [Receipt18:5](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=18-5), [error/retry18:6](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=18-6) |
| Operator workspace | [18:7](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=18-7) |

These conceptual native fields communicate hierarchy and intent; they are not live forms or a pixel-perfect specification of every browser control. Frame existence does not prove all responsive/theme/error states. Full-state Figma-to-browser alignment, logo refinement and the owner’s production visual approval remain pending. Earlier Lift/logo alternatives and frames6/8/10 are retained in the archived review; current concept/logo evaluation is tracked in [VISUAL-CONCEPT-REVIEW.md](VISUAL-CONCEPT-REVIEW.md) and [FIGMA-REIMAGINATION.md](FIGMA-REIMAGINATION.md), not inferred from old approval.

## Requirements-to-journey matrix — current scope

Current passes below refer only to source 8989c1c0d6853c608baf3c424edd34e9a99fe334 and its recorded test scope. “Historical pass” refers only to the specific prior record. No row implies full requirement closure where limits remain. Scenario IDs are acceptance labels, not promises of test filenames.

| Requirement | Need / journey | Surface / state and contract | Acceptance | Current status |
|---|---|---|---|---|
| R01 | Coherent identifiable service; W01/W05 | Public shell/concepts, controls, owner foundation | V01 compare current frames/screens, logo contexts and both themes | 80 rendering cases pass; logo refinement/full-state alignment and owner visual review open |
| R02 | Explore or contact directly; W01 | /start and new /contact; navigation/menu/404; routes | V02 direct load/refresh/Back and keyboard/menu destinations | 80 local/hosted route/theme/width cases and navigation/menu/deep-link checks pass |
| R03 | Get immediate useful advice; W02 | Unselected/selected one-task explorer; no API call | V03 all five task buttons update guidance with no email/background/POST; contextual Back retains state | Task guidance, switching, no-POST, deep-link/recovery and draft return checks pass |
| R04 | Deliberate request saved reliably; W03 | Direct/contextual ContactRequest, invalid/pending/error/receipt; POST leads v2 | V04 genuine message or task, optional context omitted, saved:true, retained failure, stable retry | 32-test suite, direct/contextual failure/retry/receipt flows and exact v2 private records pass |
| R05 | Relevant editorial starting point; W02 | Task-specific checks/human boundary | V05 all five tasks distinct, no false personalization/ranking | Task-specific browser guidance checks pass; representative-user usefulness remains untested |
| R06 | Trust claims; W01/W02 | Qualitative examples/guidance, no estimator | V06 no numeric savings/unsupported proof; no hours question pretending to tailor advice | Qualitative source and no fabricated context confirmed; no measured benefit claim |
| R07 | Email discussion or request a call; W03/W05 | plan/call v2 purpose; optional availability; receipt/status | V07 consent reset, no plan prerequisite, call unbooked, only call supports Booked | V2 direct/contextual purpose-consent-reset and call/follow-up receipt checks pass; manual scheduling remains |
| R08 | Express partnership interest; W04 | Existing partners form/API | V08 consent/required fields/failure/retry/private receipt | Current hosted partner receipt and exact private synthetic retrieval pass |
| R09 | Understand each real request; W05 | Owner message/tasks/optional fields; index/detail/status | V09 v1/v2 records render no undefined/fabricated context; persistence/reconciliation | V2/private reads/status persistence/concurrent 409/idempotent retry pass; authenticated owner walkthrough/cadence still open |
| R10 | Know what is collected; W03/W04/W06 | Privacy/consent/message/context; versioned private save | V10 truthful optional fields, message warning, no auto email; correct server notice version | V2 records verify notice 2026-09-30/no invented context; purpose consent checks pass; retention/deletion operation gate |
| R11 | Private authorized operations; W05 | Separate entries; owner auth on every admin action | V11 public boundary; anonymous/non-owner/expired/revoked denial | Current 32 tests/build/boundary 112 files/15 public modules pass; live session probes and owner checks still open |
| R12 | Complete tasks accessibly; all | Explorer announcement, direct form, menu, both themes | V12 four widths, keyboard/focus/errors/reflow/motion/contrast; separate real AT scope | 80 rendering cases/targeted keyboard flows and separate Axe 8 public routes × 2 themes zero violations; actual AT/owner checks open |
| R13 | Compatible safe deployment; W03–W07 | Version dispatch, exact legacy hash, v2 validation/storage | V13 literal legacy goldens, v2 bounds/normalization, build/types/API/private readback | 32 tests/build/type/boundary and exact hosted v2 storage/transaction checks pass; final performance/production gates open |
| R14 | Review a concrete change; W07 | Current concepts/journey frames and future preview | V14 exact source/deploy refs, comparison limitations, owner review | Source/deployment/tests recorded; conceptual frames not parity; logo/full-state alignment and owner approval open |

Admin A01–A08 production/session/recovery gates remain in [ADMIN-PLAN.md](ADMIN-PLAN.md). [WORKFLOWS.md](WORKFLOWS.md) describes recovery. Update evidence only when the actual revised test has run, preserving the old revision’s results.

## Authorities, limits and open evidence

- [OpenAI AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md): repository instruction discovery. This document architecture is a Levarum choice.
- [OpenAI frontend workflow](https://learn.chatgpt.com/use-cases/frontend-designs): concrete references, shared components and browser comparison. Build success is not visual acceptance.
- [Figma file structure](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/) and [Code Connect](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/): meaningful components/variables/layout and links to real implementation; not a guarantee that the chosen experience meets user needs.
- [Figma user flows](https://www.figma.com/resource-library/user-flow/) and [usability testing](https://www.figma.com/resource-library/usability-testing/): task/decision modeling and testing prototypes with users. AI expert walkthroughs here are not representative-user tests.
- [OpenAI ExecPlans](https://developers.openai.com/cookbook/articles/codex_exec_plans) is an archived optional recipe; its use is a project convention.

Still missing from a complete expertise review: representative owner/partner/operator interviews or task tests; measured comprehension/success/time/error evidence; actual screen-reader sessions; production account/recovery/backup checks; final visual approval. No ISO, WCAG, OpenAI or Figma certification is claimed. Accessibility checks must state exactly what was tested. Previous Axe/public browser results are historical. Fresh public task-first/contact and separate Axe results are now recorded. Authenticated owner checks, actual screen-reader sessions and representative-user tests remain unverified. Final hosted performance and complete design alignment also remain open. No approval, conformance or production readiness is inferred from code or conceptual Figma fields.
