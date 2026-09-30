# Reimagination design and accessibility QA

Date: 2026-09-30, checks began 05:59 UTC. Reviewer: UX agent. Scope: read-only source/Figma inspection and targeted local Chromium interaction checks. This report is evidence for the current reimagination, not a conformance certification, real-user study or production approval.

## Tested surface and methods

Application: source commit `8989c1c0d6853c608baf3c424edd34e9a99fe334` with documentation work in progress; local current source at `http://127.0.0.1:5178`, aligned with the task-first implementation recorded in `verification.md`. Chrome 154.0.8037.58, Playwright-controlled headless mode. Requests to lead/partner endpoints were intercepted and returned synthetic failures; no records or emails were created. Root is independently refining branding and conducting other verification; those later changes are outside this checkpoint.

Evidence: ignored repository `work/design-qa/check.mjs`, `work/design-qa/results.json`, `work/design-qa/contact320.png` and `work/design-qa/home320.png`. Existing `work/reimagination-browser/results.json` records the prior 80-case route/width/theme and mocked complete-flow pass. Existing verification documentation separately records hosted tests; the additional checks in this report were local, not repeated on the hosted deployment.

Figma: inspected live page structure/text/reactions in [concept page 16:2](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=16-2) and [journey page 18:2](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=18-2). Visually inspected contact frame18:4 and the browser contact screenshot at320px. Used the Figma skill for read-only structural inspection. No app or Figma changes were made in this QA task.

## Interaction and accessibility evidence

| Check | Observed result | Scope/limit |
|---|---|---|
| Reflow at640 and320 CSS pixels | No horizontal document overflow on Home, invoice explorer, direct contact, partners and questions:10 checks. | These correspond to the available layout widths for a1280px viewport at200%/400% zoom. They are reflow-equivalent checks, not actual browser UI zoom. |
| Text resized to200% | Doubling computed font sizes at1280px produced no horizontal document overflow on the same five routes. | CSS text-resize emulation. It does not prove every text block remains unclipped or actual browser preference behavior. |
| Actual browser zoom shortcut | Meta+Equal did not change innerWidth or devicePixelRatio in headless Chrome. | Genuine200%/400% browser UI zoom remains unverified. Do not label this a zoom pass. |
| Contact entry | Activating Discuss this task focuses the visible “Discuss your work.” heading. | Public explorer-to-contact state only. |
| Invalid email | Submitting blank contact focuses `#email` and sets `aria-invalid=true`. | Native/custom field validation path observed. |
| Return to exploration | Back to task ideas restores focus to explorer heading and preserves draft inputs. | Focus returns to page heading, not the original task action. This is a deliberate existing convention, not a failure. |
| Consent | Reopening an unchanged task preserves consent. Earlier automated suite verifies task/purpose change resets consent. | Consent preservation for unchanged purpose is not represented as new authorization for another purpose. |
| Scenario keyboard | ArrowRight from Routine invoice selects Disputed invoice; focus remains on the checked `invoice-scenario` radio. Result uses polite live region. | Semantics/keyboard observed; actual spoken announcement not tested. |
| Skip link | First Tab exposes the skip link atx16/y16 with a3px petrol outline; Enter focuses `#lv-main`. |390px viewport. |
| Reduced motion | Media preference active; Home, selected explorer and contact each report zero running animations and zero nonzero transition durations in main. | Runtime sample, not a claim about all third-party/auth widgets. |
| Contact at320px | Visual review: labels, email/message/business controls, purpose choices, consent, submit and footer are legible and remain within the viewport. | Long form requires vertical scrolling; no promise that this is the optimal field grouping. |

No VoiceOver, NVDA, JAWS or other real assistive-technology session was conducted. Automated ARIA inspection and focus assertions are not screen-reader testing. No authenticated owner session was inspected or changed.

## Actionable finding: asynchronous failure loses keyboard position

Priority P2, high-confidence reproducible interaction defect. `ContactRequest` uses `SubmissionForm` with the form disabled during saving. In the observed flow, activating submit, entering the pending/disabled state and then receiving a503 leaves the document body focused after failure. Input is retained and the error is visible with `role=alert`, but keyboard users lose their place for retry. This is independent of whether a screen reader announces the alert.

Reproduction:

1. Open `/start?task=invoices`, activate **Discuss this task**.
2. Fill `#email` with synthetic data and check `#consent`.
3. Intercept `POST /api/leads` to return503 JSON, then activate **Send my follow-up request**.
4. After the failure, inspect `document.activeElement`; it is the body rather than an error or retry control. `#email` retains its value and the alert says the request could not be saved.

Relevant files: `src/prospect/ContactRequest.tsx`, `src/prospect/SubmissionForm.tsx`, shared submission hook. Root should choose one consistent recovery convention: focus a programmatically focusable error summary after failure, or restore focus to the re-enabled submit button while retaining the announced alert. Do not move focus repeatedly during pending or while someone is editing. Apply the same convention to partner submissions where the shared mechanism is used.

Regression: hold the mocked request pending, confirm controls disabled, release it as503, confirm retained inputs, no success receipt, focus on the selected recovery target, and successful keyboard activation of retry. Test both contact intents and partner flow. Root owns the fix and retest; this document records the initial finding, not closure.

## Figma alignment and state coverage

The application follows Concept A's open editorial offer, worked example, compact task index and engagement section, with Concept B's task exploration utility. It is not a pixel-perfect implementation of every concept frame.

Observed live structure:

- 16:3/16:4 are A desktop1440/mobile390;16:5/16:6 are B desktop1440/mobile390. All are vertical Auto Layout frames. No prototype reactions were found in their descendants at this inspection.
- 18:3 and23:33/54/75/96 cover the five selected tasks. Each contains six reacting descendants connecting task choices/contact.
- 18:4 contact and18:6 error each have two reacting descendants;18:5 receipt has one. The1100px owner frame18:7 has none and combines a synthetic detail with a conflict example.
- Only760px journey frames were present on18:2, plus the1100px owner frame. No dedicated390/320px or dark-mode variants were present there.

Specific gaps to close or explicitly label before claiming complete design parity:

1. **Home scenario states:** the implementation has routine/disputed/missing-data native radios, changing next action and human-boundary copy. Concept A shows a static trigger/rule/outcome example. Add the three actual states and radio focus/selection behavior, or annotate their intentional implementation addition.
2. **Contact control fidelity:**18:4 depicts single-line message input, text-only optional business placeholder, button-shaped purpose choices and generic Send my request. Browser uses a textarea, real select, native radio choices and intent-specific submit labels, plus helper/consent text. Update the frame to actual controls and labels; retain the explicit simulated-prototype notice separately from product copy.
3. **Direct versus selected-task contact:** document required message on direct contact and optional message with selected task; preserve task context and consent reset behavior. A single generic contact frame does not express both contracts.
4. **Purpose-specific receipt:**18:5 uses a combined statement about calls and automatic email. App has separate email/call receipts. Add both; do not let the prototype imply a booking or email was delivered.
5. **Missing states:** pending/disabled submission, required-field error and focus target, explorer empty/invalid-query recovery, mobile menu open, partner form/error/receipt, owner loading/empty/denied/session-expired/logout and stale-write recovery. Existing static error/conflict text is useful but not complete interaction coverage.
6. **Tokens/components:** frames demonstrate native text, Auto Layout and reusable instances, but this inspection does not certify complete hover/focus/disabled/error variants or code mappings. Audit component variants against actual controls, not just component counts.
7. **Branding:** logos are being refined in a separate root task. Current screenshot uses the prior Lift mark. This report neither approves that mark nor claims parity with later alternatives.

## Remaining review limits

Real browser UI zoom, actual screen-reader behavior, exhaustive clipping/long-content inspection, authenticated owner interaction, representative-user comprehension and final updated Figma/browser visual review remain open. The independent Axe pass and Lighthouse results must retain their own exact tested contexts. Production still requires owner visual approval and operational/security gates; these local checks do not authorize promotion.

## Public state specification extension — later checkpoint, 2026-09-30

This section supersedes the earlier missing-core-contact-state inventory where specified; it does not retroactively change the original QA evidence.

Added **78 new top-level editable frames**, covering **13 states × three widths (320/390/1440) × two semantic theme modes** on page18:2. Final structural inspection found **3,000 current nodes, 384 reacting descendants, and zero image-filled nodes** in the new set. Earlier frames18:3–18:7 and23:33/54/75/96 remain untouched historical references. New names begin `QA2 /` to distinguish this state specification from earlier concept material.

Reuse: existing primary/secondary button instances, semantic theme/color variables, spacing variables and Instrument Sans/Schibsted Grotesk text styles. The existing field master constrained controls to48px and clipped textarea examples; new field compositions were derived from that master into editable native frames with52px inputs and120px textareas. The master was not changed. These field derivatives are **not** new reusable component variants or Code Connect mappings; that library work remains separate.

### State map

All IDs below belong to file `OWG4WbjbMmMILS4LKHzL6L`. Open a node by appending `?node-id=35-2122`, for example, to the [Figma file](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L).

| State | 320 light | 390 light | 1440 light | 320 dark | 390 dark | 1440 dark |
|---|---|---|---|---|---|---|
| explore-empty | 35:350 | 34:61 | 35:974 | 35:1598 | 35:2222 | 35:2846 |
| explore-invoices | 35:382 | 34:93 | 35:1006 | 35:1630 | 35:2254 | 35:2878 |
| direct-plan | 35:422 | 34:133 | 35:1046 | 35:1670 | 35:2294 | 35:2918 |
| plan | 35:472 | 34:171 | 35:1096 | 35:1720 | 35:2344 | 35:2968 |
| call | 35:525 | 34:212 | 35:1149 | 35:1773 | 35:2397 | 35:3021 |
| plan-validation | 35:587 | 34:258 | 35:1211 | 35:1835 | 35:2459 | 35:3083 |
| call-validation | 35:641 | 34:300 | 35:1265 | 35:1889 | 35:2513 | 35:3137 |
| plan-pending | 35:704 | 34:347 | 35:1328 | 35:1952 | 35:2576 | 35:3200 |
| call-pending | 35:757 | 34:388 | 35:1381 | 35:2005 | 35:2629 | 35:3253 |
| plan-error | 35:819 | 34:434 | 35:1443 | 35:2067 | 35:2691 | 35:3315 |
| call-error | 35:874 | 34:477 | 35:1498 | 35:2122 | 35:2746 | 35:3370 |
| plan-receipt | 35:938 | 34:525 | 35:1562 | 35:2186 | 35:2810 | 35:3434 |
| call-receipt | 35:956 | 34:543 | 35:1580 | 35:2204 | 35:2828 | 35:3452 |

Representative links: [390px email contact](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=34-171), [320px dark call failure](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=35-2122), [1440px selected explorer](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=35-1006).

### Connected behavior and actual scope

- Invoice selection moves from empty to invoice guidance; Discuss this task moves to email contact. My task is not listed opens direct contact with required-message wording.
- Purpose choices connect email/call forms within the same width/theme. Send navigates to the corresponding pending state. Pending form controls have no prototype reactions, reflecting their disabled state.
- Clearly segregated **prototype-only review controls** navigate to validation, failed save or successful receipt. These simulate outcomes for inspection; they do not pretend to perform input validation, make network calls or wait for durable storage.
- Failure states show retained synthetic input and the focus-target error summary. Annotation matches the updated `SubmissionError` implementation: focus moves to the error, and unchanged retries retain their request ID. Validation notes preserve helper/validation association and acknowledge browser-dependent wording.
- Email and call receipts contain their distinct application messages. Call receipt explicitly denies a confirmed appointment. Email receipt explicitly says no automatic email was sent.
- Back routes to invoice guidance. State annotations specify draft retention, consent reset on task/purpose change, and refresh clearing. These are documented application behaviors; the Figma prototype does not execute those stateful guarantees.

Every frame labels itself a **static synthetic prototype**. Shared application header/footer and current logo are intentionally omitted from these content/state frames. No real personal data is included. The invoice is the representative connected task; the other four task choices are displayed for composition but their new responsive states are outside this pass. Existing older task-specific frames remain available.

### Visual inspection and corrections

Inspected390px light call screenshot,320px dark call-error screenshot and1440px light selected-explorer screenshot. Initial screenshot exposed clipped textarea content and overly tall/narrow radio rows inherited from layout settings. Corrected textarea/input geometry, full-width radio rows, selected-task border and dark input outlines. Re-inspected320px dark call failure after the corrections: text areas show their complete synthetic examples, choices align to the form width, error and actions remain legible, and no horizontal clipping was visible in that frame. This is representative inspection, not a claim that every frame has been individually reviewed or that all pixel measurements match the browser.

The node/frame/count ledger is saved in the chat working directory at `work/levarum-reimagination/state-node-ledger.json`; the construction script is `state-spec.js`. Prototype edges were inspected structurally. No full Present-mode user walkthrough is claimed.

### Remaining gaps after this extension

- Full-shell/logo/header/menu parity and Home's three live scenario states are not included in these contact/explorer frames.
- The new core matrix covers invoice-context email/call states. Direct contact has its own initial form but not a separate complete error/pending/receipt matrix with no selected task.
- Partner and authenticated owner state matrices remain outside this pass; older owner mock is not verification of working authentication.
- Shared reusable field/radio/checkbox component variants, complete focus/hover specifications, Code Connect mappings and all five task-responsive variants remain incomplete.
- Browser keyboard/AT semantics cannot be established by static checkbox/radio illustrations. True zoom, real screen-reader and representative-user tests retain their previous unverified status.
