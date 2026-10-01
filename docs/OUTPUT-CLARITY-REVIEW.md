# Connected output and mobile approval — 2026-10-01

Connected now exposes a concise captured-request and draft-reply preview without opening the existing full-details disclosure. The content comes from the existing synthetic booking-enquiry sample; missing date, time and service remain explicitly missing. Both the visible preview and full details state that no booking, quote or message is sent.

At mobile/tablet widths the human-approval endpoint has its own coral-bordered panel, a 20px review heading and 16px no-auto-send explanation. Its height follows content, including enlarged text. Palette, fonts, original workflow artwork, desktop review endpoint, routes and backend are preserved.

## Coded before/after evidence

Same local Chromium 151, dark theme, reduced motion, DPR1; captures include the complete opening. These are useful change comparisons; pinned CI Chromium 143 remains the authoritative font-metric reference (see [metric reconciliation](FONT-METRICS-RECONCILIATION.md)). Natural line wrapping is preserved.

| State | Before | After |
| --- | --- | --- |
| Mobile Connected | [390px before](evidence/output-clarity-20261001/before-390-connected.png) | [390px after](evidence/output-clarity-20261001/after-390-connected.png) |
| Desktop Connected | [1440px before](evidence/output-clarity-20261001/before-1440-connected.png) | [1440px after](evidence/output-clarity-20261001/after-1440-connected.png) |
| Mobile Scattered | [390px before](evidence/output-clarity-20261001/before-390-scattered.png) | [390px after](evidence/output-clarity-20261001/after-390-scattered.png) |
| Desktop Scattered | [1440px before](evidence/output-clarity-20261001/before-1440-scattered.png) | [1440px after](evidence/output-clarity-20261001/after-1440-scattered.png) |

## Verification

Passed locally: 33 unit tests; build including TypeScript and public/private boundary checks; 12 signature cases across both themes and widths320/390/768/1024/1200/1440; 24 Axe scans with zero violations. Keyboard Enter/Space/Home/End and focus retention, reduced motion, rapid reversal, orientation changes, 200% text, nonoverlapping approval/preview, collapsed disclosure with preview visible, original vector geometry, and absence of submissions all pass. Receipts: [cases](evidence/output-clarity-20261001/results.json), [motion](evidence/output-clarity-20261001/motion.json).

Failed local checks: none. The complete CI suite runs on this pushed commit; the exact SHA and terminal result are reported in the handoff with its Actions link. CI retains authoritative browser screenshots and all suite receipts in its synthetic-browser-evidence artifact.

Unrun: authenticated Vercel preview review (sign-in blocked), real assistive technology, live identity/storage/recovery and production checks. No duplicate deployment, access change, PR, merge or production replacement. Existing [launch decisions](SIGNATURE-OPENING-REVIEW.md) remain open. Parent Figma worker can sync the verified result; this change does not write Figma.

## Bounded rendered-motion observation

Actual local Chromium 151 playback was sampled at start (20–27ms), intermediate (457–465ms) and settled (~1802ms), at390px and1440px. The captured PNGs were visually inspected: start retains scattered artwork while the Connected control and synthetic preview are present; intermediate blends the scattered loop with straight strands and begins the enquiry/details sequence; settled shows connected strands, all labels and the human-review endpoint. The preview itself appears immediately. This is a crossfade of original artwork, not a path morph. No animation was changed for this check.

| Width | Start | Intermediate | Settled | Reduced motion |
| --- | --- | --- | --- | --- |
|390px|[start](evidence/output-clarity-20261001/motion-390-no-preference-start.png)|[midpoint](evidence/output-clarity-20261001/motion-390-no-preference-intermediate.png)|[settled](evidence/output-clarity-20261001/motion-390-no-preference-settled.png)|[immediate](evidence/output-clarity-20261001/motion-390-reduce-immediate.png)|
|1440px|[start](evidence/output-clarity-20261001/motion-1440-no-preference-start.png)|[midpoint](evidence/output-clarity-20261001/motion-1440-no-preference-intermediate.png)|[settled](evidence/output-clarity-20261001/motion-1440-no-preference-settled.png)|[immediate](evidence/output-clarity-20261001/motion-1440-reduce-immediate.png)|

Separate automated property checks confirm intermediate connected opacity0.48–0.55, settled connected/review opacity1, immediate reduced-motion opacity1 and retained control focus. [Timestamp/property receipt](evidence/output-clarity-20261001/rendered-motion.json). Screenshot calls follow the recorded sampling timestamps, so images are bounded samples rather than frame-exact timings. Reduced motion visually presents the complete result immediately. This observation establishes rendered progression, not frame-rate performance or continuous human playback/usability validation. Existing rapid-reversal and reduced-motion regression checks also passed.

Application commit `f8b9986f8161d242c60fdd7fa9a78bd96f37e2bd` passed both full CI jobs in [run36818659601](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/36818659601). This later evidence-only commit changes no application or test behavior; its exact CI result is included in the final handoff.
