# Levarum public experience and owner queue

This working branch implements a browse-first React/Vite site with direct contact,
optional task guidance and a separate authenticated owner dashboard. Visitors can
read the offer and examples without submitting an intake. `/contact` asks for a
work description, email and explicit consent; an optional unchecked preference
requests a conversation. Scheduling and replies are manual through
**hello@levarum.com**. A saved call request is not a booking.

## Selected MVP journey

The owner delegated selection to prioritize first revenue on 3 October 2026. The selected path is **examples → contact → saved acknowledgement → private owner follow-up → separately agreed paid work**. [Scope and acceptance boundary](docs/REQUIREMENTS.md#selected-revenue-first-mvp--2026-10-03) is authoritative for this continuation. The mandatory questionnaire/Game Plan alternative is deferred; `/start` remains optional compatibility. This decision does not establish conversion, final design acceptance or production readiness.

## Implemented behavior versus deferred alternative

The implemented branch is not an owner-approved final MVP or proof of a production
pilot. Main's [2 October proposed MVP and NFR contract](https://github.com/taitgoodwin-gmail/Levarum/blob/222d433aee64fe1babab3261efc0e983713ca1f3/README.md#mvp-contract)
is deferred by the journey decision above. The comparison remains useful as history:

| Area | Implemented on this branch | Deferred proposal / acceptance boundary |
| --- | --- | --- |
| Customer entry | Browse first; direct contact; optional local task guidance at `/start` | Mandatory business type, hours, challenges and email before a Game Plan |
| Value and storage | Guidance requires no save; optional consented requests save privately | Intake → stored context → Game Plan as the core mandatory sequence |
| Owner queue | New, Contacted, Booked (calls only), Done; request details and status history | New/in-progress/waiting/closed semantics and source-intake/follow-up linkage |
| Acceptance | Synthetic local/CI checks and dated earlier isolated-provider evidence | Owner-approved MVP and one real end-to-end production pilot |

These proposals do not authorize new data collection, statuses, record linkage,
retention, commercial claims or production activity. Main was read, not merged or
rebased into this branch. [Requirements](docs/REQUIREMENTS.md) and
[workflows](docs/WORKFLOWS.md) describe the implemented contracts and their limits.

## Checkable requirement counts

See the [row-by-row coverage and counts](docs/REQUIREMENTS.md#requirement-coverage-counts--2026-10-03): current contract22 IDs, proposed MVP8 and proposed NFR7 counted separately. Code, test coverage, execution and owner acceptance are separate columns;60 tests and11 browser suites are not requirement counts.

## Run and check

Requires Node 24.

```sh
npm ci
npm test
npm run build
npm run dev
```

The build includes TypeScript and public/private boundary checks. GitHub Actions
runs unit tests, the build and twelve synthetic browser suites. Browser evidence
is not live Clerk or private-storage acceptance.

## Private storage and owner operation

Vercel serves the public app, separate admin entry and API handlers. Production
Blob uses `BLOB_READ_WRITE_TOKEN` or configured SDK OIDC. Preview/development
requires the dedicated `PREVIEW_READ_WRITE_TOKEN`; it must not fall back to the
production credential. Missing storage configuration fails closed. See
[operations](docs/OPERATIONS.md) for configuration and environment boundaries;
never commit or publish credentials.

`/admin` and `/admin/leads/:id` are implemented. Every API action checks the
immutable owner ID, verified exact owner email and active Clerk session. Private
Blob holds submission content; PostgreSQL holds the index, status and history.
Owner detail reads, filtered inbox and bounded reconciliation support manual
follow-up. Status changes send no email or calendar invitation. Production owner
binding/recovery and fresh hosted authenticated acceptance remain open.

Stored types are `leads/plan/` (email follow-up, including legacy intakes),
`leads/call/` and `leads/partner/`. Keys contain request IDs/content hashes, not
email addresses. An unchanged retry preserves the original record and receipt
time. A lost write response is reconciled only against its exact known private
key and matching submitted fields; an unconfirmed save is never reported as saved.
There is no public read endpoint or public lead cache. `/api/draft` is disabled.

## Public contracts and protections

- Current contact UI requires email, work description and unchecked explicit
  consent; it does not collect mandatory business/hours. Optional call timing is
  accepted. Partners provide name, email, work description, contribution and consent.
- Legacy v1 business/hours/challenge validation remains supported. V2 allows
  omitted business/hours and requires a message or known task. Current UI requires
  a message. See the [versioned contract](docs/LEAD-V2-CONTRACT.md).
- Body/origin/schema/honeypot protections and a best-effort per-instance throttle
  remain. The throttle is not distributed abuse protection.
- Confirmation requires `saved:true` after durable write or verified exact
  readback. Failed/uncertain requests retain input and unchanged retry identity.
- Guidance and worked examples are local and illustrative, with no invented
  customer proof, numerical savings or live AI execution.
- Automatic notifications are not established by the contact address. Optional
  notification failure does not discard a saved lead; plan email delivery and
  calendar integration are not implemented customer promises.

## Evidence and release boundaries

[Documentation index](docs/README.md), [execution record](PLANS.md),
[verification](docs/verification.md) and [owner acceptance](docs/ADMIN-PLAN.md)
distinguish tested, historical and unrun outcomes. The current design follows the
selected Figma direction recorded in [UX traceability](docs/UX-REDESIGN.md);
original ZIP/design exports are preserved provenance.

The working-branch preview is reviewable, not a production replacement. Before a
real pilot, resolve owner identity/recovery, exact synthetic hosted acceptance,
backup custody/cadence, retention/deletion treatment, manual inbox review,
production rollback and visual review. No automated retention or complete erasure
guarantee is claimed. See [release gates](docs/PRODUCTION-RELEASE-GATES.md) and
[recovery scope](docs/RECOVERY-PLAN.md). Main/production and PR changes remain outside
this checkpoint's authorization.
