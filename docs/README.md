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

The [current tested application preview](https://levarum-cjhcj1631-mind-lever-gmail.vercel.app) runs source `6b9a0f7` (deployment `dpl_352C2wYRW8uVsbcU5irXd3DJTeBm`). It combines immediate task guidance, optional direct contact, shared wordmark, accessible recovery and a fail-closed non-production storage selector. Production remains the earlier pilot.

[Verification](verification.md#hosted-isolation-fix-checkpoint) records 33 passing API/security tests, TypeScript/build/boundary checks, 80 hosted route/width/theme cases with real synthetic saves, exact private readback, and direct server-function concurrency/idempotence. [Performance](PERFORMANCE-BASELINE.md) records eight current-source audits with baseline-matched settings: Home mobile median98 and desktop100. Earlier hosted recovery and anonymous/fabricated denial tests remain tied to source8e80; no fresh valid owner, expired/revoked session or real screen-reader test is claimed.

[Design QA](REIMAGINATION-DESIGN-QA.md) records 78 core states, 20 shell/partner/owner references and six Home scenario excerpts in editable Figma. [Design-to-code map](DESIGN-CODE-MAP.md) records mappings and the optional Code Connect account limitation. These are not proof of full-page pixel parity or owner visual approval.

[Blob isolation](BLOB-ISOLATION.md) verifies distinct stores, corrected production-only versus preview/development credentials, preserved values and a surgically corrected local configuration. This tested deployment may have started before the scope correction; a fresh build is required for the final environment checkpoint. Old deployment snapshots are not revoked by changing variable targets.

[Production provisioning](PRODUCTION-PROVISIONING.md) records the isolated production Neon connection/schema checks and verified Clerk DNS/certificates. The prepared production Clerk connection awaits the required action-time permission; production owner enrollment/binding is incomplete. [Recovery plan](RECOVERY-PLAN.md) separates researched capabilities from tests: genuine SQL archive restoration has not run because the existing local runtime lacks pg_dump/pg_restore.

Remaining release gates: production auth/owner and current authenticated journeys, fresh deployment isolation, actual data recovery, manual operating commitments and owner visual approval. No homepage promotion, automatic customer email delivery or confirmed booking is claimed. [Release gates](PRODUCTION-RELEASE-GATES.md) retain detailed acceptance and historical checkpoints.

## Provenance and guidance

The original Levarum Design System.zip checksum is `5e8c75bfc2ceb504d3eeee60470bb28d375aabd79098c0d2e0d9b25066c5b0f3`; reviewed source is retained in `design/current/`. The local extracted source is outside the repository at `../levarum-design-system/`. Older `/designs/` and Figma captures are historical. The [15-finding source audit](UI-UX-AUDIT.md) does not substitute for the current-preview audit. [Pre-redesign documents](archive/2026-09-30-pre-redesign/PROVENANCE.md) preserve previous wording and evidence.

Current editable design work: [Levarum UX redesign in Figma](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L). Core and supporting frame links are in UX-REDESIGN.md. It is an editable reviewed reference with documented implementation differences, not evidence of owner approval or pixel-perfect application-wide parity.

[AGENTS.md](../AGENTS.md) is a supported Codex instruction mechanism. [OpenAI AGENTS guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [frontend guidance](https://learn.chatgpt.com/use-cases/frontend-designs) inform implementation. The [ExecPlans article](https://developers.openai.com/cookbook/articles/codex_exec_plans) is an archived optional recipe; PLANS.md and this documentation structure are project conventions, not a universal OpenAI standard. [Figma file structure guidance](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/) informs component/variable/Auto Layout handoff. Specific flow and branding choices are project decisions, not OpenAI/Figma mandates.
