# Requirements and acceptance criteria

Current baseline: UX correction, 2026-09-30. This document supersedes the [archived migration requirements](archive/2026-09-30-pre-redesign/REQUIREMENTS.md). Requirement IDs are retained for traceability; R03/R05/R06/R14 now reflect the authorized redesign. A requirement is not proof of completion. See [traceability/status](UX-REDESIGN.md) and [dated verification](verification.md).

## Product requirements

| ID | Required behavior | Observable acceptance |
|---|---|---|
| R01 | One warm, approachable design system with a legible brand mark and consistent public controls; admin shares foundations but prioritizes operational clarity. | Review logo in header/mobile/favicon contexts; compare representative screens with editable Figma design; no invented testimonials or unsubstantiated proof. |
| R02 | Explain the offer and expose clear paths through Home, How it works, What we automate, Questions, Partners, Start and Privacy. | Direct routes, refresh, Back and unknown-route recovery work; mobile menu has meaningful labels, semantic expanded state, keyboard/focus handling; one clear primary next action per context. |
| R03 | Collect business, weekly back-office hours and one or more tasks in one questionnaire; show guidance without requiring email or submitting personal data. | Missing selections are clearly identified; results are reachable without contact details, consent or a network save; editing retains answers and regenerates guidance; refresh limitation is disclosed. |
| R04 | Optional email follow-up and call requests save privately and truthfully. | Success only after saved:true; failed/offline/timeout/throttled saves preserve input; unchanged retries retain request identity; exact synthetic private record can be retrieved; no claim of automatic delivery. |
| R05 | Give task-specific qualitative guidance with concrete next checks and human-review boundaries. | Each selected task produces relevant advice; no arbitrary first-selected recommendation is described as a personalized priority; business/hours are context rather than a fabricated calculation. |
| R06 | Publish no personalized numeric savings or unsupported return claims. | All task/band combinations render meaningful qualitative content without calculated recovered hours, financial returns or unsupported percentages. Historical estimate values are not reinterpreted. |
| R07 | Calls are requests arranged manually by email. | Availability/timezone optional; saved confirmation states nothing is booked; no slots, invitation or delivery claims; Booked status is available only for call records after human agreement. |
| R08 | Partners can submit interest with name, work description, contribution category, email and explicit consent. | Client/server bounds and enums enforced; pending locks duplicate actions; retry preserves input/identity; acknowledgement follows saved:true and promises neither work nor agreed terms. |
| R09 | Owner can reliably retrieve, understand and follow up on every saved request type. | Authorized inbox/details and reconciliation tested; request types distinguish email follow-up, call and partner interest; manual review responsibility/cadence established before promotion. |
| R10 | Contact and privacy language matches actual processing. | hello@levarum.com throughout; contact is optional after guidance; unchecked consent required for a save; no user input in URLs/analytics/public artifacts; no invented retention or delivery promise. |
| R11 | Public and owner applications remain separate and private access is server-enforced. | Boundary check passes; public assets have no operator/private data or server credentials; /api/draft remains disabled; every admin action verifies owner/session. |
| R12 | Public/admin tasks work on mobile, keyboard and assistive technology in both themes. | 320/390/768/1440px without unintended overflow; labels/errors/state/focus verified; theme persists; reduced motion preserves content; contrast checked; actual screen-reader testing reported separately from automated scans. |
| R13 | Preserve deployment/API safeguards and truthful failure handling. | Origin, size, schema, honeypot and throttle protections pass; deep links/HTTPS work; secrets server-only; per-instance throttle limitation documented; build/typecheck/tests pass. |
| R14 | Review design before production replacement and retain provenance. | Two intake alternatives and three logo directions evaluated; editable Figma frames/components/states identified; browser comparison recorded; preview linked to commit; owner visual review precedes production promotion. |

## Public contracts — implemented, unchanged by this redesign

`POST /api/leads`: requestId (UUID v4), intent (`plan` or `call`), email, business, hours, pains (known identifiers), preferences (maximum 500 characters), consent:true, website honeypot empty. Existing accepted business labels remain valid. The UI may call intent `plan` “email follow-up”; this changes wording, not the stored schema or meaning of consent. Local guidance itself performs no POST.

`POST /api/partners`: requestId, name (1–120 characters), craft (1–1000), contribution (known category), email (maximum 254), consent:true, website empty. Partners remain a separate record type.

Both endpoints acknowledge `{saved:true}` only after durable private Blob save. No private URL is returned. Object identity derives from request ID plus canonical content hash: unchanged retry deduplicates; distinct IDs or changed content can yield separate records. UI must not promise global deduplication. Indexing is best effort after Blob save; an indexing failure must not falsely report data loss.

Theme may persist in browser storage; questionnaire/contact drafts remain in memory. Printing guidance does not save a request. No automatic email, scheduler, customer login, payment, AI draft or numerical estimator is added by this redesign.

## Definition of done

R01–R14 and [A01–A08](ADMIN-PLAN.md) have dated evidence or explicit outstanding status. Fresh preview verification covers changed journeys; previous tests are baseline evidence only. Production requires visual review, production provider/recovery setup, required security probes and an owner review routine. Record commit, deployment and rollback target without credentials or customer data.
