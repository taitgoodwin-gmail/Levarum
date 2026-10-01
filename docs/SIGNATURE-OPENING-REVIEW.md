# Levarum — Make work flow implementation checkpoint

2026-10-01. Continues `dfd612bb2410879e60af98bef45eb9c5951e1522` on `codex/design-assessment-fixes-20261001`. This is a focused opening and signature interaction, not production approval or a redesign of the entire site. Existing contact, explorer, partner, privacy and private-owner routes remain; server/auth/storage code is unchanged.

## Source and implementation

Inspected actual screenshots and full design context from [desktop scattered](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=150-3), [desktop connected](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=151-194), [mobile scattered](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=150-4) and [mobile connected](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=151-195), on page 150:2. Figma Present-mode playback remains unverified; browser motion is tested separately.

The deep teal `#062C2A`, mint `#E4F0D9`, coral `#FF785F` and muted `#A6BAB0` belong to the supplied opening. It retains that art-directed palette in both theme preferences; existing sections and enquiry pages retain their tested light/dark behavior. The theme preference still persists across routes.

Bricolage Grotesque ExtraBold, Instrument Serif Italic and Space Mono join the existing Instrument Sans. All are self-hosted from pinned Fontsource 5.3.0 packages with lockfile integrity; their original SIL OFL notices are served in `public/fonts/`. The display axes remain `opsz:14, wdth:100`; Chromium reports Bricolage's internal font name as “Bricolage Grotesque 96pt ExtraBold”, despite the CSS alias and selected axes. Font checks inspect actual custom-font glyphs, not only CSS declarations.

The Figma asset endpoint returned HTTP 403. Read-only `exportAsync({format:'SVG_STRING'})` exports preserve the actual nodes: 151:41/213 desktop sculpture, 151:128/299 mobile, original mark, header rules, signal dots, leader/pin and human-review disc/gesture. No Figma file was edited. Static artwork is local; no temporary asset links ship. Exported artwork includes the original frame crop and keeps its intrinsic geometry. Text and controls are native HTML, not flattened into artwork.

## Deliberate refinements from the reference

These implement the subsequent creative/UX panel instructions and should be reconciled back into Figma after review:

- The opening now explicitly says “Practical automation for small businesses” and refers to everyday tools.
- The reversible switch is directly above the demonstration, including mobile, instead of below the changed artwork. Both states retain the same visible enquiry, details, draft and human-approval objects.
- A keyboard-operable disclosure shows concrete synthetic captured details and a draft reply. It states the missing date/time/service, does not confirm availability, and explicitly says no booking, quote or message is sent here.
- Mobile uses 12 selected original paths from each 44-path sculpture: indices 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40 and 43. Original path geometry/colors are preserved; the other paths are omitted to reduce dense visual interference. Unmodified mobile exports are retained in the evidence directory. Desktop keeps all 44 paths.
- Mobile labels flow in a column over the decorative strands rather than shrinking with the drawing. The composition stacks below 1200px; intermediate desktop widths receive extra vertical separation. Labels are at least 12px, human approval 18px desktop/14px mobile and controls at least 52px tall. Enlarged text can wrap the header and heading.
- The native switch uses pressed states, keyboard Enter/Space plus arrows/Home/End, retained focus and a polite state announcement. Resizing preserves the chosen state. The demonstration performs no network writes.
- Original sculpture states crossfade/translate over 850ms; connected labels settle in a finite sequence by 1.65s using `cubic-bezier(.22,1,.36,1)`. This is a reversible transition between original vector states, not per-path morphing or a simulated live processing system. Rapid reversals settle to the selected state. Reduced motion removes transitions, animation and delayed labels immediately.

## Design review — Adobe's five Design headings

| Design heading | Implementation finding |
|---|---|
| Creative concept and originality | Oversized contrasting display/italic type and the supplied custom strands anchor the opening. The example turns a metaphor into an inspectable business task. No customer proof or credentials are invented. |
| Visual impact and aesthetic execution | The supplied palette, font families and native artwork remain. Mobile line density is deliberately reduced. This is an implementation assessment, not owner visual acceptance or a new numerical score. |
| Scalability and adaptability | Native responsive text/controls are separate from decorative artwork. Both states preserve their content on mobile, with a stacked tablet layout and reduced-motion support. |
| Brand storytelling and cohesion | Plain-language automation copy leads into the same enquiry, captured details, draft and human decision. The illustrative disclosure distinguishes the concept from a delivered integration. Existing lower sections are preserved, not newly expanded. |
| Functionality and usability | The switch precedes the changed content, supports keyboard and repeated activation, retains focus and never submits data. The existing accessible enquiry journey remains the route for a real request. |

## Verification and limits

**PASS:** 33 unit tests; typecheck, build and bundle-boundary checks; 80 public route/theme/width cases; 8 recovery cases; 10 failure/retry cases (including real 20-second timeout); 16 maximum-content cases; 8 existing example/form accessibility cases; 16 actual-font renders; 12 signature width/theme cases; 8 unconfigured admin guards. Across suites, 81 Axe scans reported zero violations. Finite motion, rapid reversal, keyboard/focus, resized-state retention and 200% text reflow pass. No final test failures. Initial stopped-server and font-name/geometry assertions were corrected and rerun.

Final results and selected browser screenshots are in `docs/evidence/signature-20261001/`; full local artifacts remain in ignored `work/signature-qa/`. The CI workflow includes the signature suite alongside existing font, journey, recovery, failure, maximum-content and admin-guard suites. These are Chromium and automated-accessibility checks, not WCAG certification or a real-user study. All public submissions in these suites are intercepted synthetic fixtures.

No production/live-storage/authenticated-owner journey is claimed. Safari, Firefox, actual assistive technology, current hosted performance and final hosted visual acceptance remain separate checks. The parent session coordinates the Vercel preview; this environment did not create a duplicate deployment for the preceding checkpoint.

## Smallest remaining decisions and live gates

The detailed historical gate inventory remains in [FONT-VISUAL-VERIFICATION.md](FONT-VISUAL-VERIFICATION.md#exact-remaining-launch-gates-decisions-versus-execution). Its earlier no-push restriction is superseded by explicit permission to publish this working branch and previews. Main and production remain excluded.

1. **Visual/release decision:** review this focused preview; reserve production promotion for explicit approval. Do not treat provisional earlier scores or automated checks as approval.
2. **Owner identity/access:** finish any still-pending production Clerk connection through the normal provider flow, bind the immutable production owner ID, and verify owner/non-owner/expired/revoked sessions. No credentials in chat or authentication bypass.
3. **Inbox operation:** name the reviewer and actual review cadence; confirm ability to reply from the existing mailbox. No automatic notification or delivery promise is introduced.
4. **Backup/recovery operation:** name the backup custodian and private destination; choose export/check cadence and acceptable data-loss exposure. Then verify full, consistent production recovery, deletion exclusions, account-loss access and a current rollback target using designated synthetic records. Earlier selected-record drills are not full production recovery.
5. **Retention/deletion operation:** confirm the factual retention practice and responsible person. Current code has no deletion endpoint or automatic retention job. Coordinated record/index/history/backup deletion must account for retries that could recreate a deleted request.

With authorized live access, the remaining technical work is exact synthetic contact/call/partner save → private readback → owner visibility, unchanged retry deduplication, status conflicts/reconciliation, valid owner journeys, restoration/rollback and real-domain smoke. These do not need another visual concept or new feature decisions. Safe local implementation and regression work are completed in this checkpoint; live checks cannot be replaced by more mocked passes.
