# Levarum — current product and delivery baseline

Current working baseline: UX correction initiated 2026-09-30. The user authorized substantial changes to design, flow and branding to simplify both customer and operator tasks. The supplied ZIP remains preserved source provenance, not a constraint against those authorized changes. Production remains the earlier pilot; no preview is approval to replace production.

## Read in this order

1. [UX redesign and traceability](UX-REDESIGN.md): audience needs, audit, selected flow, design decisions and evidence status.
2. [Requirements](REQUIREMENTS.md): observable acceptance criteria and stable requirement IDs.
3. [Workflows](WORKFLOWS.md): complete customer, partner and owner journeys, including recovery.
4. [Implementation details](IMPLEMENTATION-DETAILS.md) and [admin architecture](ADMIN-PLAN.md): actual interfaces and boundaries.
5. [Verification](verification.md) and [operations](OPERATIONS.md): recorded test results and remaining release gates.
6. [Execution plan](../PLANS.md): dated implementation progress. Its current milestones supersede the preserved historical migration plan.

## Current verified preview and remaining work

The [current tested preview](https://levarum-epjcu3fu0-mind-lever-gmail.vercel.app) runs application commit `d3c0a8243633075fb7b3b3d94bbed99007eedb29`, deployment `dpl_Edn1UoLYzYPdNZpf2d9PzAaXVtD3`. It provides immediate task guidance before optional contact, a shared wordmark, truthful save/retry behavior and separate private owner access. Production remains the earlier pilot.

[Public release checks](PUBLIC-RELEASE-CHECKS.md) records33 tests/build/TypeScript/boundary checks; hosted route metadata, contextual Back/refresh, both print themes and eight failure/retry cases;64 route/width/theme link inventories,13 destinations,16 maximum-content forms, sitemap/robots/headers and eight absent/fabricated admin denials. No real saves were made in these bounded follow-ups. [Earlier verification](verification.md) retains actual synthetic save/readback/concurrency evidence on84663f5 and80 responsive cases on application6b9a0f7. [Performance](PERFORMANCE-BASELINE.md) is scoped to6b9a0f7: Home mobile median98/desktop100, not a fresh audit of d3c0a824.

[Design QA](REIMAGINATION-DESIGN-QA.md) closes design selection/specification: connected public/partner journeys, owner state references, shared foundations, requirement-to-code mapping and matched1440px light/390px dark Home comparison. Figma remains a static form/state prototype with disclosed spacing/overlay/theme-execution differences; no pixel-parity or owner-approval claim. [Acceptance matrix](LAUNCH-ACCEPTANCE-MATRIX.md) separates completed scope from release gates.

[Blob isolation](BLOB-ISOLATION.md) records separate production/preview stores and credential scopes; current non-production fails closed without its dedicated credential. Old deployment snapshots are not revoked by scope changes. [Provisioning](PRODUCTION-PROVISIONING.md) records the approved isolated production Neon connection/schema and verified Clerk DNS/certificates. The separate Clerk production connection still awaits its pending action-time approval, followed by verified production owner binding.

[Recovery](RECOVERY-PLAN.md) records actual selected-record synthetic SQL/Blob restoration, including combined application reads/reconciliation and status continuity. [Operations](OPERATIONS.md) now specifies exact-record deletion/copy handling and backup custody, with a passed localhost synthetic deletion test. No production restore, ongoing backup routine, cloud deletion, retention commitment or email delivery is implied.

Remaining release gates: production authentication/verified owner and fresh authenticated journeys; owner account recovery and operating/backup custody commitments; explicit visual approval; then production promotion and real-domain synthetic smoke. Actual assistive-technology and representative-user evidence remains separately unverified where unavailable. [Release gates](PRODUCTION-RELEASE-GATES.md) retains the detailed boundary and historical checkpoints.

## Provenance and guidance

The original Levarum Design System.zip checksum is `5e8c75bfc2ceb504d3eeee60470bb28d375aabd79098c0d2e0d9b25066c5b0f3`; reviewed source is retained in `design/current/`. The local extracted source is outside the repository at `../levarum-design-system/`. Older `/designs/` and Figma captures are historical. The [15-finding source audit](UI-UX-AUDIT.md) does not substitute for the current-preview audit. [Pre-redesign documents](archive/2026-09-30-pre-redesign/PROVENANCE.md) preserve previous wording and evidence.

Current editable design work: [Levarum UX redesign in Figma](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L). Core and supporting frame links are in UX-REDESIGN.md. It is an editable reviewed reference with documented implementation differences, not evidence of owner approval or pixel-perfect application-wide parity.

[AGENTS.md](../AGENTS.md) is a supported Codex instruction mechanism. [OpenAI AGENTS guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [frontend guidance](https://learn.chatgpt.com/use-cases/frontend-designs) inform implementation. The [ExecPlans article](https://developers.openai.com/cookbook/articles/codex_exec_plans) is an archived optional recipe; PLANS.md and this documentation structure are project conventions, not a universal OpenAI standard. [Figma file structure guidance](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/) informs component/variable/Auto Layout handoff. Specific flow and branding choices are project decisions, not OpenAI/Figma mandates.
