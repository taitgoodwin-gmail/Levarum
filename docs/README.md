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

[Current wordmark/recovery preview](https://levarum-9tvocbmhj-mind-lever-gmail.vercel.app) runs application source `8e80f5de339cdd62bdb01cfcdb257f183cb50e87`, deployment `dpl_5oxtDaZnuyTp9iBceQjos1i1R7mP`. Wordmark-first is implemented across public/owner layouts with a matching theme-aware favicon. Immediate task exploration and direct contact use the backward-compatible v2 request contract, genuine optional context, explicit consent and truthful durable receipts.

The [current evidence checkpoint](verification.md#wordmark-and-recovery-preview--2026-09-30) records 32 passing API/security tests, build/typecheck/boundary (112 scanned files, 15 public modules), 80 local/hosted route-width-theme checks, eight hosted repeated-failure recovery cases, and eight live absent/fabricated-admin-token denials. These are not valid non-owner/expired/revoked-session tests. No fresh owner session, new-source real private-record readback or new Lighthouse run is claimed.

Historical evidence remains tied to its tested revision: source 8989 verified three exact synthetic private records, v2 notice/no fabricated context, status concurrency/idempotence, and separate public Axe scans. [Performance evidence](PERFORMANCE-BASELINE.md) includes frozen local baseline/candidate measurements and source 8989 hosted results; its scores must not be relabeled as current 8e80 measurements. Earlier provider/owner walkthroughs likewise remain historical.

[Design QA](REIMAGINATION-DESIGN-QA.md) records 78 core QA2 state frames plus 20 representative QA3 shell/partner/owner frames in editable Figma, with remaining coverage gaps. [Design-to-code map](DESIGN-CODE-MAP.md) maps the implemented wordmark, controls and source, and explains that Code Connect is unavailable on the current account without an eligible paid seat. No paid capability is required for this handoff. Frames and agent review do not establish pixel parity, live authentication or owner visual approval.

[Production provisioning](PRODUCTION-PROVISIONING.md) now verifies an isolated production-only Neon connection, distinct preview/production databases and exact application DDL/rolled-back SQL checks. Those are not authenticated API or backup-restore tests. The Clerk resource accepted external domain levarum.com configuration; DNS/certificates, production variables, owner identity and actual sign-in still require verification. No paid add-on or production homepage promotion occurred.

Remaining gates: current authenticated-owner walkthrough and live session-denial checks; final-source performance and design alignment; manual accessibility/actual screen-reader and representative-user evidence limits; production Clerk/domain/owner/Blob-isolation/recovery, review/privacy operations and owner visual approval. See [release gates](PRODUCTION-RELEASE-GATES.md). Automatic customer email, confirmed bookings, AI drafting and customer accounts are not implemented promises.

## Provenance and guidance

The original Levarum Design System.zip checksum is `5e8c75bfc2ceb504d3eeee60470bb28d375aabd79098c0d2e0d9b25066c5b0f3`; reviewed source is retained in `design/current/`. The local extracted source is outside the repository at `../levarum-design-system/`. Older `/designs/` and Figma captures are historical. The [15-finding source audit](UI-UX-AUDIT.md) does not substitute for the current-preview audit. [Pre-redesign documents](archive/2026-09-30-pre-redesign/PROVENANCE.md) preserve previous wording and evidence.

Current editable design work: [Levarum UX redesign in Figma](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L). Core and supporting frame links are in UX-REDESIGN.md. It is an editable reviewed reference with documented implementation differences, not evidence of owner approval or pixel-perfect application-wide parity.

[AGENTS.md](../AGENTS.md) is a supported Codex instruction mechanism. [OpenAI AGENTS guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [frontend guidance](https://learn.chatgpt.com/use-cases/frontend-designs) inform implementation. The [ExecPlans article](https://developers.openai.com/cookbook/articles/codex_exec_plans) is an archived optional recipe; PLANS.md and this documentation structure are project conventions, not a universal OpenAI standard. [Figma file structure guidance](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/) informs component/variable/Auto Layout handoff. Specific flow and branding choices are project decisions, not OpenAI/Figma mandates.
