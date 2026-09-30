# Levarum design-package UI/UX audit

Date: 2026-09-29. Scope: the supplied Levarum Design System ZIP, not a claim about defects in the currently deployed pilot. The ZIP is a prototype reference; intentional simulation becomes a blocker only if carried into production.

Method: source inspection of the marketing, intake, admin and shared components; local browser walkthrough of Home, theme toggle/reload, demo admin sign-in, mobile admin layout, intake steps and keyboard controls. Mobile viewport was 390 × 844. No real leads were read, no messages sent, no accounts provisioned, and no live website code changed. This is a manual design/interaction audit, not an axe/Lighthouse report, penetration test or accessibility conformance certification. Full responsive, screen-reader and performance verification remains a preview-stage gate.

## Verdict

Keep the visual direction. Its typography, warm surfaces, restrained accent colors, recognizable business examples and intentional empty testimonial slot establish a coherent identity. The useful next step is to correct interaction and truthfulness gaps while implementing it—not redesign the brand. The prototype is not ready to serve as the production application unchanged.

15 findings are recorded below. Priority indicates release impact: P0 blocks secure launch; P1 needs resolution before its affected live flow ships; P2 is a usability/consistency improvement; P3 is minor content cleanup. Findings are not marked fixed by being added to the plan.

## Findings and retest criteria

### UX01 — P0: Admin is a browser-only gate

Evidence: `ui_kits/admin/AdminApp.jsx`, `signIn`, compares printed owner/levarum values and sets local `authed` state. The local browser accepted these demo values. There is no production identity/session or server permission check in this kit.

Fix: implement the owner account for taitgoodwin@gmail.com and server-authorized private APIs from ADMIN-PLAN.md. Keep the branded sign-in presentation, remove demo credentials from production.

Retest: anonymous, expired and non-owner sessions cannot list, view or mutate any record via direct APIs. Owner can sign in, recover access and sign out. Maps to A01, A02, A05.

### UX02 — P1: Success states do not prove saving, sending or booking

Evidence: partner submit in `ui_kits/marketing_site/QuestionsScreen.jsx` only calls `setSent(true)`; intake unlock only changes route; selecting hardcoded SLOTS sets local slot and displays “You are booked.” The kit labels itself a prototype but these states must not be imported as live success paths.

Fix: save through real endpoints before acknowledging customer/partner requests; replace slots with manual call-request UI. Remove plan-delivery and calendar-invite implications unless implemented.

Retest: failed/offline saves never show success; valid synthetic records are privately retrievable; call confirmation explicitly says nothing is booked yet. Maps to R04, R07, R08.

### UX03 — P1: Estimate exceeds reported time

Browser reproduction: choose Under 5, keep Invoice chasing + Booking selected, proceed to gate. It displays “4 to 8 hours” back alongside “Under 5 hrs / week.” Source uses `cap + 4` for upper bound; individual rows remain uncapped.

Fix: choose a reviewed estimate policy, reconcile row/total behavior and explain illustrative assumptions. Keep personalized numbers disabled until that policy passes tests.

Retest: all 31 nonempty pain combinations × four bands; no upper bound exceeds the documented policy, totals make sense, assumptions are disclosed. Maps to R05, R06.

### UX04 — P1: Mobile admin collapses the lead information column

Browser evidence at 390px after demo sign-in: first two row grids measured 277px wide with computed columns `0px 261px`. The action column consumes the row; no page scrollbar is required for this failure to occur. Source `Row` uses `1fr auto` with an action column minimum width of 210px.

Fix: stack lead summary above actions on narrow layouts; allow email wrapping and full-width readable summaries. Keep status buttons away from accidental taps on neighboring actions.

Retest: 320px and 390px display readable lead type, email, preferences and every action without overlap or a zero-width column. Maps to R12, A06.

### UX05 — P1: Intake email has no accessible name

Evidence: email gate passes TextField an id, type and placeholder but no label or aria-label. Browser accessibility tree reports an unnamed text field. The nearby heading does not programmatically label it.

Fix: add a persistent Email label associated with the input; link helper/error text with aria-describedby and mark invalid state. Keep autocomplete appropriate.

Retest: accessibility tree names the field Email, conveys its error, and a keyboard/screen-reader user can correct it. Maps to R03, R12.

### UX06 — P1: Some keyboard-focusable actions cannot activate

Browser reproduction: focus “← Back a step” at the gate and press Enter; the gate remains unchanged. Source gives the div role button/tabIndex/onClick but no keyboard handler. “Start again” and partner “Add another” have the same source pattern.

Fix: use native button elements for actions, preserving styling.

Retest: Enter and Space activate each control; new step receives sensible focus; no mouse required. Maps to R03, R12.

### UX07 — P2: Home asks for a choice that is discarded

Evidence: `HomeHero` business selection lives in component state; its CTA is an unchanged relative intake URL, and IntakeApp initializes its own first business value. There is no transfer of the selection.

Fix: carry the non-sensitive business choice into intake or remove the extra Home input. Do not require the visitor to enter the same choice twice.

Retest: select a non-default category on Home and start; intake shows it, while a fresh direct intake entry still has an explicit valid selection flow. Maps to R02, R03.

### UX08 — P2: Theme control loses synchronization after reload

Browser reproduction: switch Home to dark, then reload. DOM retains data-theme="dark" but the button says Dark rather than Light. ThemeToggle initializes local mode to light while the page bootstrap reads the saved setting.

Fix: derive all theme UI from a single initialized source of truth and provide a descriptive accessible label.

Retest: reload/navigation respects the saved mode; one click always changes the actual theme; label describes the next action. Maps to R01, R12.

### UX09 — P1: Production consent/privacy interaction is missing

Evidence: supplied intake and partner fields do not provide the existing pilot's explicit storage/contact consent. Kit email copy asks where to “send” a plan even though it is only displayed. Footer contact is hello@levarum.co.

Fix: preserve consent from the working pilot, add it to partners, link the actual privacy notice, correct all contacts to hello@levarum.com and state exactly what submitting does.

Retest: server rejects missing consent; both forms expose privacy before submission; confirmation and delivery wording match actual behavior. Maps to R08, R10.

### UX10 — P1: Proof copy overstates what exists

Evidence on rendered Home: “This site runs on the product” promises a booking line and reminders; the supplied kit only simulates booking and the planned launch uses manual scheduling. “Published industry figures” and “numbers above are cited” appear without supporting source links in that section. Before/after examples describe “real service businesses” alongside “No customer stories yet.”

Fix: identify examples as illustrative unless provenance is established; verify and link each retained statistic; replace automation proof claims with things the live release actually demonstrates. Review delivery timing and paid-partner claims with the owner.

Retest: a visitor can distinguish example, estimate, published evidence and actual customer outcome; every operational promise is demonstrated or removed. Maps to R01, R10.

### UX11 — P2: Navigation has demo dead ends

Evidence: rendered intake/admin navigation uses href="#"; logo points to local server root rather than kit Home. Source confirms these placeholders. Marketing hash routing also treats unknown hashes as Home, potentially conflicting with the skip link on secondary pages.

Fix: canonical production routes; preserve skip-link behavior without routing to Home; no placeholders in navigation.

Retest: every header/footer/logo link, direct route, refresh, Back and skip link reaches the intended destination and focus target. Maps to R02, R12.

### UX12 — P3: FAQ count is inconsistent

Evidence: marketing README describes nine questions; headline and Home link say seven. The FAQ source includes the expanded set rather than making the visible count derive from data.

Fix: derive the count from FAQS or remove the number from copy; verify the actual rendered list during implementation.

Retest: visible counts agree with the rendered questions. Maps to R10.

### UX13 — P2: Radio chips omit expected grouped keyboard navigation

Browser reproduction: focus/select Under 5 and press ArrowRight; selection remains unchanged. ChoiceChip handles Enter/Space only and every radio is tabIndex 0.

Fix: prefer native radio inputs styled as chips, with a fieldset/legend, or implement the full grouped-radio keyboard behavior.

Retest: arrows move selection within the group, Tab moves predictably into/out of it and the selected state is announced. Maps to R03, R12.

### UX14 — P1: Admin workflow lacks production reliability states

Evidence: list is initialized from SEED; setStatus only changes local state, while copy claims refresh persistence. The kit has no API pending/failure/conflict/session-expiry states. Customer and partner rows share the same Booked action regardless of intent; demo emails use realistic domains.

Fix: implement real records and durable transactional status changes, loading/empty/error/conflict UI, audit history and type-appropriate actions. Use example.com addresses in any public demos. Distinguish “call requested” from actually booked.

Retest: refresh preserves status, failure retains previous state, concurrent edit is handled, logout clears data, partner does not require a meeting, demo data cannot be mistaken for actual submissions. Maps to R09, A03–A07.

### UX15 — P2: Form errors are not tied to their controls

Evidence: TextField renders an alert but does not set aria-invalid or link helper/error IDs. Intake and partner screens use custom click handlers instead of a consistent form submit path. Step transitions observed in the browser leave focus at the page rather than explicitly announcing the new heading.

Fix: native forms and buttons, field-level errors linked to inputs, summary where helpful, and deliberate focus management after validation/step transitions.

Retest: pressing Enter submits correctly, errors identify the affected field, values survive recovery and keyboard focus does not restart unexpectedly. Maps to R03, R08, R12.

## What to preserve

Keep the coherent token system and first-person, concrete business language. Preserve the explicit example label on the Home plan and the reserved proof card. Retain the existing focus-visible styling, reduced-motion stylesheet, labeled select component and large form controls; they provide a useful starting point. These observations are not blanket accessibility passes—computed contrast and all interactive states still need verification.

## Remediation order

First, fix production truthfulness and security: UX01–03, UX09–10, UX14. Next, fix core usability: mobile lead rows, field labels, native keyboard controls and focus/error behavior (UX04–06, UX13, UX15). Then resolve selection continuity, theme state, navigation and copy consistency (UX07–08, UX11–12).

Implementation evidence should include before/after screenshots where useful, the exact reproduction steps above, relevant tests and the commit containing the fix. Run automated accessibility/performance checks on the implemented preview, then manual keyboard/screen-reader checks. Do not assign invented axe scores or Lighthouse scores to this source audit.

## Implementation retest checkpoint — 2026-09-29

This table reports evidence from the implemented preview. Original findings above remain the historical audit. “Implemented” alone is not a verified fix. See [verification](verification.md) for exact test scope and remaining release gates.

| Finding | Current evidence / status |
|---|---|
| UX01 | Server ID allowlist, verified owner email and live session checks implemented; negative paths tested with injected provider responses. Real Clerk login/recovery/revocation blocked by setup. **Open release gate.** |
| UX02 | Hosted synthetic plan/call/partner saves privately retrieved; failed plan submission retains inputs; call receipt explicitly unbooked. Public fix verified. |
| UX03 | Personalized savings numbers removed. Qualitative opportunities cannot exceed reported hours. Static design figures are explicitly illustrative, not customer outcomes. |
| UX04 | New stacked admin CSS implemented; setup page passes mobile overflow checks. Populated owner inbox awaits real authentication/data. **Not fully verified.** |
| UX05 | Intake Email has a persistent associated label; native invalid state gets aria-invalid and associated error text. Browser correction verified. |
| UX06 | Native Back button activates with Enter; reset/add-another use working navigation links. No inert role-button actions in the new flow. |
| UX07 | Home Online shop choice arrived selected in intake during local and hosted tests. |
| UX08 | Dark theme reload and next-action label verified; next click returns to light. |
| UX09 | Both public forms require consent; server rejection covered by tests. Privacy/contact copy corrected; no automatic plan-email claim. |
| UX10 | Unsupported industry statistics and fixed delivery/support promises removed; examples labelled illustrative. No claimed customer proof added. |
| UX11 | Public routes, deep links and unknown-route recovery loaded at four widths. Skip link focuses main; admin has a separate entry. |
| UX12 | Numeric FAQ count removed from headline/link copy; nine actual questions remain. |
| UX13 | Native radios support ArrowRight selection; verified in browser. |
| UX14 | Transactional status/history, reconciliation, conflict UI and pending/error/session states implemented. Provider and database concurrency/persistence tests pending. **Open release gate.** |
| UX15 | Native form submission, retained failure values, associated validation and focused step headings verified for intake. Partner save verified. Manual screen-reader testing remains outstanding. |

Additional implemented correction: Home's long brand badge wrapped after browser checks exposed 320px overflow. Axe 4.12.1 found zero settled-state violations across eight pages in both themes, including only the admin setup screen—not the populated dashboard. Figma/gallery updates await visual review.
