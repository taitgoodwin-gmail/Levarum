# Lead v2 contract — task-first and direct contact

Date: 2026-09-30. Status: implementation specification requested by the implementation lead, recorded before coding. This document specifies an additive contract; it is not evidence that v2 is deployed or tested. It refines [the offer/journey review](OFFER-JOURNEY-REVIEW.md). User journey: task-only exploration without saving, followed by optional contact, or direct /contact without a questionnaire. No fabricated context is permitted.

## Endpoint and version dispatch

Use the existing `POST /api/leads`. Preserve plan/call stored kinds, private prefixes and success response. Do not introduce a contact kind, database migration or separate endpoint.

- A JSON object with **no own schemaVersion property** uses the existing legacy parser unchanged.
- A JSON object with the numeric literal `schemaVersion: 2` uses v2.
- Any other supplied version, including 1, 3, "2", null or an explicit undefined in direct parser tests, is invalid. Do not fall back to legacy.
- Non-object/null/array bodies fail as today. Existing method/content-type/origin/body-size/storage/throttle protections remain unchanged.
- Additional properties outside the defined v2 request fields are ignored and never copied into canonical/stored data, matching the current parser’s allowlisted output approach. This must not permit client status, role, timestamp, storage path or privacyVersion overrides.

The legacy path remains strict: it still requires its genuine business, hours and one-to-five input pains. Adding v2 must not quietly make unversioned old requests valid when they previously failed.

## V2 request

| Property | Required / validation | Canonical value |
|---|---|---|
| schemaVersion | Required numeric literal 2 | 2 |
| requestId | Required string; same case-insensitive UUID-v4 regex as legacy | Original accepted string, unchanged; no new case normalization |
| intent | Required plan or call | Exact value |
| email | Required string; trim/lowercase then same existing regex and maximum 254 characters | Trimmed lowercase |
| business | Optional; if present must be a string exactly matching existing BUSINESS_TYPES | Exact accepted string; omit key when absent |
| hours | Optional; if present must exactly match existing HOURS_BANDS | Exact accepted value; omit key when absent |
| pains | Required array, input length 0–5 inclusive; every entry must be a known pain ID | Deduplicated and lexically sorted, same rule as legacy |
| message | Required string, input length maximum 1000 characters; trim before testing meaningful content | Trimmed string, possibly empty only when at least one pain remains |
| preferences | Required string, input length maximum 500 characters | Trimmed for call; empty string for plan, as legacy |
| consent | Required boolean literal true; never coerce | true |
| website | Honeypot; absent or empty string accepted; any other provided value rejected for v2 | Excluded entirely |

After validation/normalization, require `pains.length > 0 || message.length > 0`. A direct enquiry uses `pains: []` plus the visitor’s actual nonempty message. A task-based request may use a selected pain and `message: ""`. No generic hidden message is added to satisfy this rule.

Absent optional business/hours means omitted properties, not empty string, null, "Unknown", "Something else", "Under 5" or any inferred substitute. Present undefined fails a direct parser test; JSON clients omit the key. Preserve those distinctions through parser, record and UI. The new contact UI may offer business optionally; it does not ask for weekly hours. V2 accepts optional genuine hours only for compatible future clients or explicit retained context; it does not infer an estimate.

No `source` or tracking field is required or stored. There is no verified business need to record whether a visitor came from an explorer or directly; task/message content expresses the actual request. Do not fabricate prior exploration or a source label. Do not put email/message in URLs, analytics or public logs.

### Valid direct-call example

```json
{
  "schemaVersion": 2,
  "requestId": "123e4567-e89b-42d3-a456-426614174000",
  "intent": "call",
  "email": "example@example.com",
  "pains": [],
  "message": "I would like to discuss organizing enquiry handoffs.",
  "preferences": "Weekday mornings, Eastern time",
  "consent": true,
  "website": ""
}
```

This illustrative fixture has no business/hours. Its message and availability are synthetic example input, not defaults. An email-follow-up request uses intent plan and preferences "".

## Canonicalization and immutable retry compatibility

`leadPath` remains `leads/{intent}/{requestId}-{sha256(JSON.stringify(canonicalLead))}.json`. The digest is over the canonical lead only; server timestamps/privacyVersion do not enter it. JSON property insertion order is part of the existing hash behavior and must be preserved deliberately.

**Legacy canonical keys and order must remain byte-for-byte:** requestId, intent, email, business, hours, pains, preferences, consent. Retain the exact existing validations and normalization, including unchanged requestId case, sorted/deduplicated pains, call preference trim and plan preferences normalized to empty. Do not append schemaVersion, message, default context or reordered fields. Existing unknown extra fields remain ignored as before. Do not change legacy honeypot acceptance incidentally while adding the stricter explicit v2 rule.

**V2 canonical construction order:** schemaVersion, requestId, intent, email, then business only if present, then hours only if present, then pains, message, preferences, consent. Construct a new object with this allowlisted order; never hash the submitted object or spread untrusted input into storage. Omitted optional keys must not be materialized. Equivalent input property order, email case/whitespace, pain ordering and trimmed message/call-preference whitespace produce the same canonical object/hash. Different meaningful message/context/purpose yields another content-addressed record rather than overwriting one. Distinct request IDs remain distinct submissions; no global deduplication promise is made.

The UI continues reusing a requestId for an unchanged failed/retried submission and locking concurrent submit actions. Client identity handling must not generate a new ID merely because optional blank controls were serialized differently on retry. Exclude omitted optional values consistently; no browser persistence of personal drafts is added.

## Response, storage and notifications

- Retain HTTP 200 `{ "saved": true, "reference": "<requestId>" }` only after durable private save. Never return a Blob URL or private detail object.
- Preserve current error behavior: malformed/invalid request 400, unsupported content type 415, origin denial 403, unsupported method 405, per-instance throttle 429, unavailable configuration/storage 503. Current public error wording need not expose validation internals.
- Preserve private immutable Blob save and exact-key retry verification; no record overwrite or automatic deletion. Best-effort index failure does not turn a successful durable submission into reported failure.
- V2 records include schemaVersion/message and genuinely supplied context. Existing records are read in place; no backfill that invents optional values or rewrites hashes.
- Existing plan/call prefixes remain valid for index/reconciliation/status handling. No Postgres table change is needed because content stays in Blob and kinds are unchanged.
- Automatic customer email remains unavailable. The optional server notification formatter must tolerate both record variants, include supplied message/context, and omit absent context or label it Not provided; never print undefined or infer an answer. Do not activate delivery, introduce credentials or claim testing it as part of the parser change.

## Privacy, retention and owner rendering

Update the public privacy notice alongside v2 UI: selected tasks and an optional problem description are submitted only on deliberate contact; business/weekly-hours context is collected only when actually supplied; availability is optional. A directly entered message is required when no task is selected. Explain manual follow-up and call arrangement; keep the warning against passwords, financial account details and sensitive customer records. No new marketing subscription or AI processing is introduced.

Use privacy notice version `2026-09-30` for newly saved v2 records, with its effective date matching the changed notice. Preserve `2026-09-29` on new legacy records and historical existing records so the old retry representation is not rewritten. Server owns this version and receivedAt. Partner behavior/content is unchanged by this contract; its existing record version remains until that notice/process is deliberately changed.

There is no newly approved retention duration, automated deletion schedule or tested production recovery guarantee. Do not invent one. Continue the documented private access/correction/deletion contact at hello@levarum.com and owner verification process. Deletion operations must account for matching Blob content, index/history and correspondence; retain the production-operation gate until the actual procedure and cadence are established. This contract is not a legal-compliance certification.

Owner details display the reply address, request type, human-readable tasks, message and genuinely supplied context. Use “No task category selected” for an empty pains array when the user described their work instead; “Not provided” may label absent business/hours in a summary, or omit those rows. Neither string is stored as if it were submitted. Legacy records have no message; render an absence or omit it, do not imply data loss. Render free text as escaped text, not HTML. Retain version/history, reply link and type-aware status controls: only call may be Booked, after a human agreement. No public bundle imports owner renderers or data.

## Required acceptance tests before release

1. **Legacy golden compatibility:** fixture with fixed UUID confirms exactly the previous normalized JSON string, property order and SHA-256 path. Repeat for plan and call; do not generate the expected value through the changed implementation. All currently valid legacy fixtures remain valid; currently invalid missing business/hours/pains remain invalid.
2. **Version dispatch:** absent version uses legacy; only numeric2 uses v2; 1/3/"2"/null/explicit undefined fail; unknown additional fields cannot enter stored data or override server metadata.
3. **V2 optional context:** task request omits business/hours and saves; genuine supplied values save; empty/null/undefined/unknown values fail. Direct message with pains[] saves. Neither guidance nor direct contact invents background.
4. **Bounds and types:** missing/non-string/over-1000 message fails; whitespace-only message with zero pains fails; empty message with known pain passes; input pains length6/unknown pain fails; valid duplicates deduplicate; preferences type/500 limit enforced. Consent false/absent/string and nonempty/non-string v2 honeypot fail before saving.
5. **Canonical equality/separation:** reordered request properties/pains and normalized whitespace/email preserve path; changed message/context/intent produces a different path. Optional absence stays absence. V2 cannot collide with legacy’s canonical object.
6. **Durable acknowledgement/retry:** deferred/rejected save never acknowledges early; identical retry finds exactly the existing private object and preserves original receivedAt/privacyVersion; partial index failure still reports saved. New legacy records retain old metadata version; v2 uses new server version.
7. **Privacy and admin:** exact synthetic v1/v2 records can be read privately and shown without crashes/undefined text; arbitrary HTML message remains text; both kinds reconcile/index; status/history/concurrency/authorization tests still pass. No real customer records needed.
8. **Public journeys:** zero submission POST before guidance; fresh /contact works without questionnaire; changing purpose resets consent; call availability is never submitted for plan; failed submission retains data, pending locks edits and retry retains identity; receipts match saved purpose and never imply booking or automatic email.
9. **Release regression:** existing 21 API/security tests plus meaningful v2 tests, build/typecheck/public-boundary, both themes/mobile/keyboard and exact hosted synthetic retrieval. Report separate manual accessibility, owner-session and production-readiness gates honestly.

Implementation should use explicit legacy/v2 types and narrow before accessing optional context. Completion evidence belongs in verification and current requirements only after tests run. No v2 acceptance is implied by writing this specification.
