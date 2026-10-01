# Round 2 implementation checkpoint

2026-10-01. The authorized cloud-workspace continuation implements the refined service-first Home and Contact design on a separate review branch. Production and PR4's branch remain unchanged. Final preview review and existing production release gates still apply.

## Owner feedback: further design work required

The owner has asked for a substantially more modern, distinctive layout, color and motion direction for both MVPs. This Round2 application is a provisional technical checkpoint, not the selected final design. Further Figma exploration is underway before visual finalization. Existing implementation, tests and source history are preserved.

## Design source and scope

Latest native editable references are on **08 Round 2 · Implementation handoff** in the [Levarum Figma file](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L):

- [Home desktop, 115:19](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=115-19)
- [Home mobile, 115:114](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=115-114)
- [Contact desktop, 115:209](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=115-209)
- [Contact mobile, 115:239](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=115-239)

High-fidelity design context and screenshots were inspected for all four frames. Page06/07 and earlier sources remain preserved. This is implementation of the latest direction, not a claim of owner visual approval, representative-user research or pixel-perfect parity.

## Implemented behavior

Home now explains the service with “Spend less time on repeat admin.”, one “Tell us what you need” contact action, three static before/after examples, three engagement steps, four visible buying answers and a closing invitation. See examples scrolls to the real section. The desktop process illustration is static and is omitted on small screens. The previous interactive invoice scenario controls are removed from Home.

Contact now asks for the work description first, then email, optional call preference and required unchecked consent. All new UI requests require a trimmed, nonblank description, including old contextual entries. Business and hours are omitted. Selecting or clearing call preference resets consent; a non-call submission sends empty preferences, even when an earlier call draft exists. Existing task context remains genuine and visible. Pending locks, in-memory drafts, native validation, focused errors, unchanged retry identity, the 20-second timeout, and durable `saved:true` receipts remain.

Receipt copy explains future email review. Call receipts explicitly say that no call is booked. The shared failure copy now distinguishes connection failure from an unconfirmed save. `null` JSON also fails confirmation safely. Validation cleanup runs on the bubbled change event after field-specific custom validity updates, keeping help text while clearing repaired errors.

## Intentional compatibility and design differences

- Existing `/start`, task deep links, contextual Back/retained drafts, `/how-it-works`, `/what-we-automate` and `/questions` remain functional. The new primary journey does not depend on them. Round2's proposed route retirement is not applied silently; historical guidance remains accessible for existing links. No old API parser, payload hash, record type or stored data is reinterpreted.
- The latest Figma header is deliberately minimal: logo plus contact action, or Back to Home on Contact. The content specification's earlier three-link header is superseded by these four latest frames. Footer links remain real Partners, Privacy and email destinations.
- The footer retains the working theme preference control. The four supplied frames specify light mode; dark mode is a neutral/clay accessible derivative, not a separately approved Figma composition.
- Real links and checkboxes retain generous hit areas and focus indicators. Contact may therefore be taller than the static form frame. Layout adapts between specified widths rather than freezing Figma pixel coordinates.
- The exact joined-L vector is exported from Figma node99:4 to `public/brand/round2-joined-l.svg` and reused as the favicon. The temporary asset URL returned HTML rather than SVG; Figma's supported native SVG export supplied the unchanged asset. Its native26×36 dimensions are preserved. Header/footer compose it with the existing Schibsted Grotesk font. Dark mode uses a CSS light-tone filter on that same asset. No screenshot is used as page content.
- Public styles are scoped to `.lv-round2-shell`. The private operator application retains its existing foundation and default logo, rather than receiving an unverified layout redesign.

## Evidence and limits

At this checkpoint Node24 `npm test` passes33/33, `npm run typecheck` passes and `npm run build` passes including113-file boundary and15-reachable-public-module checks. No API/server/private-storage/auth implementation or secret configuration changed.

Local automated browser launch was attempted with installed Playwright/Chromium. The executor denied Chromium's Unix socket initialization before page creation, including a reviewer-admitted escalated retry; cloud Browser also blocked localhost. These attempts are **not browser passes**. A separate CI browser job uses only synthetic mocked submissions and the exact built commit. [Run36806352096](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/36806352096) on commit `2d7c600378790779ad51776555fe4b530783e0dd` passed all four public browser suites:80 route/width/theme cases;8 repeated keyboard-error recoveries;10 offline, real20-second timeout, throttled, malformed-JSON and saved:false retries; and16 maximum-content email/call forms across320/390/768/1440px and both themes. Twenty-five enabled Axe scans reported zero violations, and recorded page errors were empty. These are scoped automated results, not screen-reader or WCAG-conformance claims. [Synthetic screenshot/log artifact](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/36806352096/artifacts/11138335163).

That run failed only the separate admin-negative harness: credential-free CI intentionally returns503 `Admin setup is incomplete`, while the older configured-preview probe expected401. The explicit CI-only unconfigured-mode correction verifies the exact503 error-only/no-store response; the default configured401 checks remain unchanged. No fake identity, credentials or weakened authorization were introduced. The corrected exact-commit CI run must pass before treating the aggregate check as green.

Home and Contact light screenshots at1440/390px and representative dark screenshots were visually inspected from that CI artifact. The exact logo is visible in header/footer; no clipping or substituted imagery was found. Home measures2371px desktop/3464px mobile. Contact is taller than Figma due real control hit areas and the retained theme action, as documented above. The stronger visual redesign remains pending.

Vercel published the same source to a protected preview, deployment `dpl_6eRiWQoNbuSLb5UrJuWF4ZnkdZdT` ([preview](https://levarum-jhmbpvf71-mind-lever-gmail.vercel.app)). The authenticated connector verified the earlier c800305 root HTML and new metadata, but the cloud browser redirected to Vercel sign-in and child fetches returned authentication redirects. These deployment checks do not constitute hosted interaction QA. No access bypass or security-setting change was made. Review-branch publication succeeded; creating a draft PR still requires separately confirmed authorization.

Authenticated owner journeys, current real private-save readback, production Clerk/owner setup, operating/recovery commitments, actual assistive-technology sessions, final owner visual review and production smoke remain separately scoped in [release gates](PRODUCTION-RELEASE-GATES.md). Earlier hosted tests apply only to their recorded commits. This change does not claim those gates closed.
