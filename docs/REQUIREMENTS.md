# Requirements and acceptance criteria

> Implementation checkpoint (2026-09-29): public flows are implemented and verified in a hosted preview; private admin code is implemented but Clerk/Neon setup and live admin tests remain incomplete. Production is unchanged. [Verification](verification.md) and [operations](OPERATIONS.md) supersede historical planning-state statements below.


Status: proposed implementation baseline. “Must” specifies intended behavior; it does not assert the feature exists. Scope is the supplied design applied to the working pilot, with a preview review before homepage replacement.

## Current state

The production pilot has intake and call requests backed by private Vercel Blob storage, explicit consent, server validation and failure handling. API implementation: `api/leads.ts` and `server/leads.ts`; UI: `src/prospect/PilotApp.tsx`. Automatic lead notifications and plan email delivery are not enabled. Admin and AI drafting are not active production features. The `/designs/` gallery contains older, explicitly simulated designs. Baseline main commit: `2e7b9fa3089d78476efc4a894bb14d67a0bf94d4`.

## Launch requirements

| ID | Requirement | Acceptance evidence |
|---|---|---|
| R01 | Use the supplied later `--lv-*` design: Schibsted Grotesk, Instrument Sans, warm paper, rust action color, petrol secondary, brand mark and dark theme. Preserve intentional reserved proof space. | Desktop and mobile screenshots compared with the supplied marketing and intake kit; documented deviations; no invented testimonials. |
| R02 | Implement Home, How it works, What we automate, Questions and Partners with proposed routes `/`, `/how-it-works`, `/what-we-automate`, `/questions`, `/partners`; retain `/privacy` and `/designs/`. Intake starts at `/start`. | Navigation, direct URL load, refresh and browser Back work; CTA opens intake; unknown path has a recovery link. Redirect legacy entry links if needed. |
| R03 | Intake asks business type, weekly-hours band and one or more challenges, then explains the plan and asks for email/consent. | Empty selections cannot progress; Back preserves answers; errors are visible and associated with fields; focus moves to the new step heading. |
| R04 | Preserve durable, private plan and call submission. | Success appears only after saved:true; mocked storage failure produces retryable error and retains input; retry does not create an additional identical lead; a synthetic production request is retrieved privately. |
| R05 | Present estimates honestly, in hours, with consistent totals and a deterministic first recommendation. | No money-savings promises; all combinations of 1–5 pains and hours bands are tested; lower bound <= upper bound; totals and rows agree or explicitly explain overlap/capping. Numerical display remains gated until R06 passes. |
| R06 | Resolve the supplied estimate defect and validate its assumptions before release. | “Under 5” plus all pains must never yield 4–8 recovered hours. Choose and document a conservative illustrative cap or collect exact weekly hours; do not claim a coarse band reveals actual availability. Explain illustrative assumptions and annualization, or omit numerical estimates. |
| R07 | Use manual email scheduling at launch. | CTA says “Request a 15-minute call”; saved confirmation says nothing is booked yet; no fabricated slots, calendar invite or delivery claims. A real booking integration, if later selected, must verify availability and a provider booking ID before confirming. |
| R08 | Partners captures name, work description, contribution category and email, with clear storage/contact consent. | Client/server reject invalid or oversized data; private save precedes acknowledgement; failed save never says “on the list”; synthetic partner can be retrieved by the owner. |
| R09 | Make lead follow-up operational. | Owner can find a plan, call and partner test request through an authorized private surface. A tested notification path or documented manual review responsibility exists before accepting traffic. Email notification failure does not lose the saved lead. |
| R10 | Use hello@levarum.com consistently and align privacy/copy with actual behavior. | No .co contact references in shipped pages; no claim a plan was emailed unless delivery is implemented; published source links and business promises reviewed; deletion/contact procedure documented. |
| R11 | Preserve prospect/operator separation and no public lead reading. | Boundary check passes; public bundle has no operator logic/credentials; unauthenticated record reads unavailable; `/api/draft` remains disabled. Demo admin is never treated as secure authentication. |
| R12 | Support usable mobile, keyboard and assistive-technology interaction in both themes. | At 390px and a narrow 320px viewport: no unintended horizontal overflow; all forms, menu, accordion and theme toggle usable by keyboard; visible focus, labels, semantic states, reduced-motion support; contrast checked. |
| R13 | Preserve deployment and API safeguards. | HTTPS, privacy route and deep links work; secrets remain server-side; existing origin/body-size/honeypot/throttle checks retained; rate limiting documented as per-instance unless upgraded. Build and relevant tests pass. |
| R14 | Update design artifacts after the preview is reviewed. | Figma and a labeled public preview reference this ZIP, distinguish live vs demo behavior and link to the relevant version; old boards remain clearly archival. |

## Data and interface decisions

Keep existing `POST /api/leads` compatible: requestId (UUID v4), intent (plan or call), email, business, hours, pains (known identifiers), preferences (max 500 characters), consent:true, and empty website honeypot. Preserve `{saved:true}` success and existing error responses; no private Blob URL in responses. Existing object keys are `leads/{intent}/{requestId}-{contentHash}.json`; records include receivedAt and privacyVersion. This is request-content deduplication, not a guarantee against distinct IDs producing separate records.

The new kit's business labels differ from the server allowlist. Explicitly map UI labels to accepted values or introduce stable IDs with backward compatibility; do not silently broaden validation. Pain IDs are shared but numerical ranges differ, so use one reviewed estimate implementation rather than mixing old and new ranges.

Proposed partner interface: `POST /api/partners`, with requestId, name (1–120 characters), craft (1–1000), contribution (one of the kit's four categories), email (max 254), consent:true and empty website. Save privately under `leads/partner/`, adding receivedAt and privacyVersion server-side. Match lead endpoint protections and saved:true semantics. This endpoint does not exist yet. Preserve a separate partner type instead of forcing partner data into business-intake fields.

Record no personal input in analytics, URLs, screenshots or public logs. Browser draft answers should remain in memory by default; the theme preference may persist. Do not promise refresh recovery unless it is implemented. Retention duration and deletion procedure must be explicit before publishing changed privacy text; do not invent a retention period.

## Admin scope and deferred features

Secure admin is required in the first release (user-confirmed): server-verified identity, owner authorization, session expiration, private record access, audited status updates and sign-out must precede real lead access. Its workflow is documented in WORKFLOWS.md and ADMIN-PLAN.md, but the kit's owner/levarum demo credentials cannot ship as security. AI drafting, customer plan emails, paid checkout, customer accounts and automatic calendar booking are outside the initial migration unless separately added to scope.

## Definition of done

R01–R14 and A01–A08 in ADMIN-PLAN.md each has recorded evidence or an explicitly documented scope decision. The owner sees a working preview before homepage replacement. No demo success path is presented as live functionality. Production checks verify the chosen follow-up method and all launch submission types. The deployment ID, commit, remaining limitations and rollback target are recorded in PLANS.md.
