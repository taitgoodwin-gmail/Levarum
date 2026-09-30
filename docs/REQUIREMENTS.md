# Requirements and acceptance criteria

Current baseline: task-first exploration and direct contact, 2026-09-30. The [previous questionnaire baseline](archive/2026-09-30-before-task-first/REQUIREMENTS.md) preserves earlier requirements/evidence. Current explorer/contact/v2 source has passed 32 tests/build/boundary, 80 local/hosted rendering cases plus interaction checks and exact synthetic private-record verification at source 8989c1c0d6853c608baf3c424edd34e9a99fe334. See [current evidence](verification.md#task-first-and-v2-verification--2026-09-30). Earlier 21-test/72-case evidence remains historical. No blanket R01–R14 closure is claimed. See [offer/field review](OFFER-JOURNEY-REVIEW.md), [v2 contract](LEAD-V2-CONTRACT.md), [traceability](UX-REDESIGN.md) and [verification](verification.md).

## Product requirements

| ID | Required behavior | Observable acceptance |
|---|---|---|
| R01 | One warm, approachable design system with a legible brand mark and consistent public controls; admin shares foundations but prioritizes operational clarity. | Review logo in header/mobile/favicon contexts; compare representative screens with editable Figma design; no invented testimonials or unsubstantiated proof. |
| R02 | Explain the offer and expose clear paths through Home, How it works, What we automate, Questions, Partners, Start, direct Contact and Privacy. | Direct routes, refresh, Back and unknown-route recovery work; mobile menu has meaningful labels, semantic expanded state, keyboard/focus handling; one clear primary next action per context. |
| R03 | Show task-specific guidance immediately when a visitor chooses one task; require no business, hours, email or questionnaire. Provide direct /contact without exploration. | Switching tasks updates guidance locally without POST; no guessed selection; contextual contact shows the actual task; direct contact accepts a genuine description with no invented context; returning to exploration retains tab state; refresh limitation disclosed. |
| R04 | Optional email follow-up and call requests save privately and truthfully. | Success only after saved:true; failed/offline/timeout/throttled saves preserve input; unchanged retries retain request identity; exact synthetic private record can be retrieved; no claim of automatic delivery. |
| R05 | Give task-specific qualitative guidance with concrete next checks and human-review boundaries. | Each selected task produces relevant advice; no arbitrary first-selected recommendation is described as a personalized priority; optional business context is collected only at contact and never claimed to tailor static guidance. |
| R06 | Publish no personalized numeric savings or unsupported return claims. | All five task choices render meaningful qualitative content without calculated recovered hours, financial returns or unsupported percentages. Historical estimate values are not reinterpreted. |
| R07 | Calls are requests arranged manually by email. | Availability/timezone optional; saved confirmation states nothing is booked; no slots, invitation or delivery claims; Booked status is available only for call records after human agreement. |
| R08 | Partners can submit interest with name, work description, contribution category, email and explicit consent. | Client/server bounds and enums enforced; pending locks duplicate actions; retry preserves input/identity; acknowledgement follows saved:true and promises neither work nor agreed terms. |
| R09 | Owner can reliably retrieve, understand and follow up on every saved request type. | Authorized inbox/details and reconciliation tested; request types distinguish email follow-up, call and partner interest; manual review responsibility/cadence established before promotion. |
| R10 | Contact and privacy language matches actual processing. | hello@levarum.com throughout; contact is optional after guidance; unchecked consent required for a save; no user input in URLs/analytics/public artifacts; no invented retention or delivery promise. |
| R11 | Public and owner applications remain separate and private access is server-enforced. | Boundary check passes; public assets have no operator/private data or server credentials; /api/draft remains disabled; every admin action verifies owner/session. |
| R12 | Public/admin tasks work on mobile, keyboard and assistive technology in both themes. | 320/390/768/1440px without unintended overflow; labels/errors/state/focus verified; theme persists; reduced motion preserves content; contrast checked; actual screen-reader testing reported separately from automated scans. |
| R13 | Preserve deployment/API safeguards and truthful failure handling. | Origin, size, schema, honeypot and throttle protections pass; deep links/HTTPS work; secrets server-only; per-instance throttle limitation documented; build/typecheck/tests pass. |
| R14 | Review design before production replacement and retain provenance. | Two intake alternatives and three logo directions evaluated; editable Figma frames/components/states identified; browser comparison recorded; preview linked to commit; owner visual review precedes production promotion. |

## Public contracts — legacy preserved, explicit v2 added

The [v2 specification](LEAD-V2-CONTRACT.md) is authoritative for exact dispatch, canonical key order, bounds, privacy version and regression tests. Current source implements the task-first/contact integration, with current API/browser/private-record passes recorded in verification. This does not close manual owner/accessibility, design alignment or production gates.

`POST /api/leads` without a schemaVersion retains the previous accepted fields, strict validation, normalization and content hash byte shape: requestId, intent plan/call, email, required business/hours, one-to-five pains, preferences maximum 500, consent:true and honeypot. Existing valid clients remain valid; old invalid omissions are not silently accepted.

Only numeric `schemaVersion:2` opts into v2. Required fields include requestId, intent plan/call, email, pains array zero-to-five known IDs, message string maximum 1000, preferences string maximum 500 and consent:true. Require at least one selected pain OR a trimmed nonempty message. Business/hours are optional but must match existing values if supplied; omitted means absent, never an invented default. New UI offers optional business and no hours question. Purpose remains email follow-up or call; plan discards call preferences. Unknown supplied versions fail. Guidance sends no POST.

V2 stores genuine message/context and server privacyVersion 2026-09-30; historical/legacy records and normalized keys stay unchanged. Same plan/call prefixes, index/status architecture and saved:true/reference response remain. Owner detail and optional notification formatting must safely handle absent context. No automatic email, source-tracking field or new stored kind is added.

`POST /api/partners`: requestId, name (1–120 characters), craft (1–1000), contribution (known category), email (maximum 254), consent:true, website empty. Partners remain a separate record type.

Both endpoints acknowledge `{saved:true}` only after durable private Blob save. No private URL is returned. Object identity derives from request ID plus canonical content hash: unchanged retry deduplicates; distinct IDs or changed content can yield separate records. UI must not promise global deduplication. Indexing is best effort after Blob save; an indexing failure must not falsely report data loss.

Theme may persist in browser storage; exploration/contact drafts remain in memory. Printing guidance does not save a request. No automatic email, scheduler, customer login, payment, AI draft or numerical estimator is added by this redesign.

## Definition of done

R01–R14 and [A01–A08](ADMIN-PLAN.md) have dated evidence or explicit outstanding status. Fresh preview verification covers changed journeys; previous tests are baseline evidence only. Production requires visual review, production provider/recovery setup, required security probes and an owner review routine. Record commit, deployment and rollback target without credentials or customer data.
