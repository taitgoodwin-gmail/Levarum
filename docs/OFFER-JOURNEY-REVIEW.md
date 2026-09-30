# Offer and journey review — autonomous launch stage 2

Date: 2026-09-30. Scope: current Levarum public/owner source, current requirements/workflows, and two competing providers’ primary homepages. This is senior business-analysis/AI-assisted review. No competitor conversion data, representative-user research, customer interviews or new business commitments were obtained. Recommendations below are implementation decisions/hypotheses until tested; competitor statements remain their own marketing claims.

## Recommendation

Use a clear service-led Home with concrete worked examples, immediate task exploration, and an equally discoverable direct discussion path. Remove business type and weekly-hours questions from access to guidance: source inspection establishes that neither changes it. Retain useful task guidance and human controls. Collect only genuine context when the visitor deliberately requests follow-up. Add an explicit compatible request version for direct contact rather than inventing answers to satisfy the legacy contract.

The selected experience should communicate a service, not imply that Levarum is an autonomous software product or that selecting tasks yields a fully assessed implementation plan. The website can demonstrate thoughtful approaches to five recurring tasks; actual suitability, commercial scope, tools, access and delivery must be agreed separately.

## Current evidence and offer brief

**Established project facts:** Levarum targets owner-run/small businesses needing help with repeated administrative work. Five public task categories exist: recurring customer questions, invoices, copying data, scheduling/reminders and new enquiries. Visitors can explore qualitative guidance without an account. Consented requests save privately; the sole authorized owner can review them. Public contact is hello@levarum.com; correspondence and call scheduling are manual. Partner interest has a separate private form. There is no verified automatic customer email, live booking, guaranteed financial result, published price, delivery SLA or support package.

**Source evidence:** `src/domain/guidance.ts` contains five static task-indexed entries with change/check/control text. `src/prospect/IntakeFlow.tsx` selects entries using pains only; business/hours are echoed above the results and included in the saved record. `server/leads.ts` still requires a known business, hours band and one to five pains for either intent. `src/marketing/Pages.tsx` repeatedly sends visitors to /start; a bypass exists only as an email link in Questions. The current /start path has no direct-discussion mode.

**Intended service, not validated delivery history:** identify a suitable repetitive workflow, agree a limited implementation, build/test within that agreement, and specify ownership/handover/support. Existing copy proposes those steps; this review does not establish previous client delivery or an approved universal deliverable. Publish them as how work would be agreed, not evidence of proven customer results.

**Human controls:** show exceptions and approvals within examples, avoid unreviewed sensitive decisions, and check source data/access/compatibility before implementation. Guidance describes these controls; it does not certify that a real customer integration already implements them.

## Two competitor observations

Public pages inspected directly on 2026-09-30. These are positioning and information-architecture observations, not endorsements or independently verified performance claims. No third competitor was necessary to establish the useful contrast.

| Primary source | Observable convention | Levarum application / limit |
|---|---|---|
| [Luhhu](https://luhhu.com/) | Leads with a narrowly defined automation service, distinguishes repair/unfinished/new work, and offers an asynchronous contact route. Its page also publishes speed and credential claims. | State a concrete task/service and permit direct contact without forcing a call or questionnaire. Do not borrow turnaround promises, client counts, certifications or a tool specialization Levarum has not established. |
| [XRAY](https://www.xray.tech/) | Separates hands-on hourly assistance from larger ongoing work; its homepage explains engagement models and foregrounds the people using workflows. | Explain what happens between the initial enquiry and agreed implementation. Retain human controls in task examples. Do not invent Levarum packages, published prices, team capacity or case studies to imitate this structure. |

**Differentiation hypothesis:** useful task guidance without an email gate, explicit human-review points, plain language and an optional small next step can make Levarum approachable to an owner who knows the annoying task but not the automation platform. These are promising positioning choices; they are not unique-market claims or evidence of higher conversion. Avoid generic “AI transformation” or large-agency presentation unsupported by actual delivery capacity.

## Field audit

Every current public field is covered below. Technical protection fields are not customer questions. “Optional” means omitted or visibly left blank when unknown, never replaced by guessed values.

| Field | Actual use today | User/operator value | Decision |
|---|---|---|---|
| business | Required enum; echoed in guidance; stored and displayed in owner details. Does not select or tailor guidance. | Potential context for a human reply, not established qualification logic. | Remove before guidance. Offer optional business category at contact only if it remains concise; retain explicit “Something else” solely as a real user choice, never a fallback. |
| hours | Required enum; echoed/stored; no calculation, tailoring or operator prioritization uses it. | A broad workload estimate might inform discovery later, but there is no demonstrated current decision use. | Remove from new UI. New contract permits omission. Continue reading historical values; ask in an actual discussion if relevant. |
| pains | Selects the matching static guidance and conveys task interest to operator. | Directly explains what the visitor wants to explore. | Make this the only exploration input; one or more choices for an ideas result. Direct contact can describe other work without selecting a fixed category. |
| email | Required for contact; saved and used for manual reply. | Necessary reply address for the chosen follow-up. | Require only at intentional contact, label Email, validate, preserve after failure. |
| intent | plan/call; distinguishes receipt and operator type; call enables Booked status. | Tells owner whether the visitor wants email discussion or a call request. | Retain existing values; display Email follow-up / Request a 15-minute call. No automatic call confirmation. Reset consent when purpose changes. |
| preferences | Optional, maximum 500; retained only for call. | Availability/timezone can reduce scheduling exchange. | Keep optional for call only. Never repurpose it to carry the user’s general problem description: plan parsing discards it. |
| consent | Literal true required before save. | Explicit storage/contact permission for the selected purpose. | Keep unchecked initially, separate from exploration, purpose-specific and renewed on purpose change. |
| website | Honeypot; nonempty rejected. | Abuse protection, no user need. | Retain hidden/inaccessible to ordinary interaction; no content change. |
| requestId | Client UUID; combined with canonical content for stable retry identity. | Prevents an unchanged retry from duplicating the same request. | Preserve; not a visible question. Changing content/purpose creates a distinct canonical request. |
| New message | Not supported today; legacy parser discards unknown fields. | Describes a task outside the five examples or the specific difficulty the owner should discuss. | Add a bounded, trimmed problem-description field in the explicit new contract. Require it only when no task is selected; no customer documents, passwords or sensitive records requested. |
| Partner name | Required 1–120; saved/displayed. | Basic identity for a potential working relationship. | Keep; this separate collaborative context justifies it, without adding a name requirement to prospect contact. |
| Partner craft | Required 1–1000; saved/displayed. | Core description of contribution/skills. | Keep with concrete prompt: “What work would you like to contribute?” |
| Partner contribution | Required category; saved/displayed; no current inbox category filter. | Quick interpretation, partly overlaps the description. | Keep current contract during this release and retain explicit Not sure yet. Do not claim automated matching. Consider making optional only after an operator use review, not for visual symmetry. |
| Partner email/consent/requestId/website | Same reply, permission, retry and abuse roles. | Supports intentional private application. | Preserve separate partner contract and truthful interest receipt; no promise of work. |

## Proposed information architecture and exact copy

Maintain all current public route URLs and historic hash redirects. Use plain link labels rather than introducing new branded vocabulary. Add /contact as a direct route; it must load/refresh independently, without an exploration prerequisite. Put partner/privacy/contact email in the footer and retain a discoverable partner link. The admin stays separate and absent from public navigation.

| Surface | Recommended text / behavior |
|---|---|
| Main navigation | What we automate · How it works · Questions; primary action **Discuss your work** to /contact. Brand returns Home. Mobile menu has the same destinations. |
| Home eyebrow | **Practical automation for owner-run businesses** |
| Home heading | **Make repeat work easier.** |
| Home supporting copy | “Explore practical ways to handle customer questions, invoice follow-up and the admin between your tools. See what could change, what to check, and where a person stays involved.” |
| Home actions | Primary **Explore a task** to /start; secondary **Discuss your work** to /contact. Helper: “Explore ideas without an account or email.” |
| Service explanation | “Start with the work you repeat. If an idea looks useful, contact Levarum to discuss the details. Any build starts with an agreed scope, price and responsibilities.” Avoid implying a fixed package has been approved. |
| Worked example | Invoice becomes overdue → check approved exclusions → prepare/send the agreed reminder → flag exceptions to a person. Label **Example workflow**; explain that actual tools, permissions and rules must be agreed. |
| Explorer /start | Heading **Which task would you like to improve?** Helper “Choose a task to see an approach, questions to check and decisions to keep with a person.” Show five clear task choices and **My task is different — discuss it** to /contact. |
| Guidance | Per selected task: **What could change**, **Check before building**, **Keep a person involved**. Actions **Discuss this task**, **Choose another task**, **Print or save ideas**. No fabricated prioritization, assessment score or time estimate. |
| Contact /contact | Heading **What would you like help with?** “Describe a task or ask a question. Levarum will review your request and reply by email. Calls are arranged by email.” Email + selected-task summary or message + purpose + optional availability. |
| Message label | **What would you like help with?** Helper “A short description is enough. Include the tools involved if useful. Please do not send passwords or customer records.” Required for direct contact without selected tasks; optional when context already exists. |
| Consent | “I agree that Levarum can store these details and contact me about this [follow-up request/call request].” Privacy link, unchecked box. |
| Submit | **Send follow-up request** / **Send call request**; pending **Saving your request…** |
| Follow-up receipt | **Your request is saved.** “Levarum will review your request and reply to [email]. No email has been sent automatically.” Avoid a response deadline until the owner commits to one. |
| Call receipt | **Your call request is saved.** “Levarum will contact you at [email] to agree a time. This is not a confirmed appointment.” |
| Failed submission | “We could not save your request. Your details are still here. Try again, or email hello@levarum.com.” Do not imply a failed request is already in the inbox. |
| Owner inbox/detail | **Requests**; types **Follow-up request**, **Call request**, **Partner interest**. Show provided task/message context and reply address before optional background. Show an explicit absence label for missing context, never pretend it was supplied. |

The current one-question-per-number framing and “three questions” claim should disappear when business/hours are removed. Keep a short direct email fallback on Contact/Questions, but do not make mailto the only obvious route for ready prospects if the first-release private inbox is expected to receive them.

## Journey maps and recovery

**Exploratory prospect:** Home/example → task selection → immediate local guidance → change/compare task or print → optional Discuss this task → review retained task summary, enter email, choose follow-up purpose, consent → save → truthful receipt. Choosing/editing tasks sends no submission POST; no contact details are needed for exploration. Back retains state in the same tab. Refresh limitation is disclosed, not silently promised away.

**Ready-to-contact prospect:** Home/header /contact → short description + email + purpose, optional call availability and business context → consent → save → receipt. No quiz is required. If arriving with selected tasks, retain those as visible editable context; do not hide imported selections. No query string contains email/message. A local edit/back transition retains input; navigating away/refresh does not promise recovery.

**Partner:** Partners → understand contribution types and separately agreed terms → name/work/category/email/consent → save → interest receipt. Failure retains data; unchanged retry reuses identity; reset creates a new request. No customer questionnaire or booked status is imposed.

**Owner:** authorized sign-in → identify request type/status/time → open details → read selected tasks or free-text message, email and genuinely provided context → reply manually → record Contacted/Done; only calls may become Booked after agreement. Missing context is a discovery prompt, not an error or invented value. Reconciliation, expired-session denial, stale-version refresh and logout remain unchanged. A changed contact contract must be reflected in optional notification formatting even though email delivery is not configured/claimed.

All paths retain invalid-field feedback, pending lock, offline/timeout/429/storage failure recovery, stable unchanged retry identity and success only after saved:true. No external message is sent by this documentation review.

## Contract options — specify before implementation

### Option A: no server change

Make /start task-first locally; defer business/hours to the existing follow-up form, where the current API still requires genuine selections. Give ready prospects a visible direct mailto link.

This is backward compatible and contains no fabricated values, but web contact remains unnecessarily long and the mailto bypass is not a stored dashboard request. It is a fallback, not the recommended completed journey. Do not label the extra fields “optional” while the server requires them.

### Option B: explicit additive version on POST /api/leads — recommended

Retain the exact existing unversioned contract and normalization for old clients/records. Add a discriminated `schemaVersion: 2` contract for the new UI; preserve endpoint, intent values, `{saved:true, reference}` response, private key prefix, status kinds and authorization boundaries. This avoids new database kind/status migrations.

Required v2 fields: schemaVersion:2, requestId UUID v4, intent plan|call, valid email, consent:true, website empty, and pains array of zero to five unique known IDs. A trimmed message is zero to 1000 characters. Require at least one known pain OR a nonempty message, so the operator receives actual task context. Do not invent a task for a direct enquiry. Permit optional business/optional hours only if they exactly match existing allowlists; omitted is distinct from a supplied category or band. Retain preferences string maximum 500, normalized empty for plan and trimmed for call. New UI omits hours; no question implies it affects guidance.

Represent absent optional values as omitted in canonical v2 content, not null, guessed values or literal strings such as Unknown. Render “Not provided” in admin only as an absence label. Stored v2 record includes its explicit version and message. Build a deterministic v2 canonical object, sort/deduplicate pains and trim optional strings consistently before hashing. Keep the legacy parser and canonical object unchanged so retries of previous payloads retain their original content-addressed paths. Unsupported supplied schema versions fail validation rather than silently falling back to legacy.

Maintain the existing 8 KB body ceiling, origin/content-type/honeypot/throttle checks, durable private save, best-effort indexing and no public reads. Existing `leads/(plan|call)/...` keys remain valid; admin index/status schema does not require a migration. Update private detail rendering for message/optional context, notification formatting to omit missing values, privacy field descriptions and synthetic fixtures. Never accept arbitrary URLs or trust client role/status fields.

### Option C: new contact endpoint/type

A separate /api/contact could use an independent schema. It would require explicit changes to Blob prefix validation, admin kind/filter/status rules, reconciliation and tests. That extra migration has no established benefit for the same follow-up/call operator workflow. Do not choose it solely to avoid versioning the existing validator.

### Required compatibility and behavior tests for option B

1. Existing unversioned valid payloads still save; existing invalid/missing-context payloads still fail; exact legacy canonical object/key stays unchanged.
2. Valid v2 task-based request can omit business/hours; valid direct enquiry uses message and empty pains; neither route fabricates context.
3. Empty pains plus empty/whitespace message fails; unknown task/category/band/version and oversized message/preferences fail. Missing/false/string consent never saves.
4. Task-first exploration produces no save; direct /contact works on fresh load without prior questionnaire state.
5. Purpose change resets consent; only call carries availability; email and call receipts match the payload and appear only after durable save.
6. Equivalent v2 payload normalization preserves retry identity; changed purpose/content never overwrites another record; legacy retries remain unchanged.
7. Both versions index, reconcile, display and update status correctly; only call records support Booked; missing optional context does not crash detail/notification formatting.
8. Failed/pending/duplicate-click UI, exact synthetic private retrieval, public-boundary checks and owner authorization remain intact.

These are proposed contracts/tests, not implemented or verified in this stage-2 review. Engineering must review the exact discriminated type/canonicalization before coding; the lead agent selects the implementation and updates the current contract documents when adopted.

## Updated requirement-to-journey decisions

| Requirements | Journey need | Proposed decision | Acceptance / evidence status |
|---|---|---|---|
| R02/R03 | Explore one task without avoidable questions | Immediate task selector; remove business/hours prerequisites; preserve existing route | Source dependency audit proves no current tailoring; new browser flow not yet implemented |
| R03/R05/R06 | Useful honest guidance | Use actual selected task; show check/control; no numeric or arbitrary ranking | Existing guidance source supports task-specific model; quality remains expert judgment |
| R04/R07/R10 | Ready prospect can ask directly and choose how to hear back | Add /contact plus v2 genuine context, purpose-specific consent and receipt | Contract/tests specified above; not yet an accepted runtime contract |
| R08 | Relevant partner application | Preserve separate form; clearer contribution prompt and terms caveat | Existing backend adequate; no matching/work promise |
| R09/R11 | Operator can understand and act on real requests | Message/tasks before optional context; preserve private authorization/status history | Existing operator infrastructure adequate after optional-field rendering updates |
| R12/R13 | Accessible resilient contact and exploration | Keyboard/focus/retained failures/no-save exploration and compatible schemas | Current tested preview is baseline only; new states require retest |
| R14 | Concrete review before production | Design both exploration and direct contact in Figma, then compare actual preview | Production visual approval remains required |

## Unresolved business facts and safe omissions

These questions inform future commitments; omit unsupported claims while implementation continues.

- **Service capacity:** who performs delivery, what technical integrations are actually supported, and whether Levarum specializes in any platform. Do not display partner badges, a large team or universal integration coverage.
- **Target segment:** owner-run businesses is the current broad brief; strongest initial sector, geography and regulated-data capability are not established. Do not imply a medical/privacy compliance qualification from an existing business-category option.
- **Commercial model:** pricing, minimum project, deposit, change requests, ownership/license transfer and support/monitoring scope are not confirmed. State that terms are agreed for the work; no invented package/pricing anchor.
- **Response operation:** the owner must commit to lead-review cadence before launch. Do not claim a same-day reply, a booked slot or automatic email delivery.
- **Proof:** no approved customer case studies, testimonials, client counts or measured savings are available. Use labeled illustrative workflows rather than empty testimonial cards or borrowed claims.
- **Partnership geography:** current “Remote, wherever you are” is broader than verified operational/legal capacity. Prefer “Tell us what you would like to contribute. Scope, availability and terms are agreed separately” until geography/payment arrangements are confirmed.
- **Privacy retention/recovery:** no invented retention duration or verified production backup guarantee. Keep current launch gates explicit.

No new user answer is required to implement the task-first/direct-contact design with these claims omitted. A real operating commitment, paid decision, account access and final production visual approval still require the authorized owner where applicable.
