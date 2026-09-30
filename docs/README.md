# Levarum — current product and delivery baseline

Current working baseline: UX correction initiated 2026-09-30. The user authorized substantial changes to design, flow and branding to simplify both customer and operator tasks. The supplied ZIP remains preserved source provenance, not a constraint against those authorized changes. Production remains the earlier pilot; no preview is approval to replace production.

## Read in this order

1. [UX redesign and traceability](UX-REDESIGN.md): audience needs, audit, selected flow, design decisions and evidence status.
2. [Requirements](REQUIREMENTS.md): observable acceptance criteria and stable requirement IDs.
3. [Workflows](WORKFLOWS.md): complete customer, partner and owner journeys, including recovery.
4. [Implementation details](IMPLEMENTATION-DETAILS.md) and [admin architecture](ADMIN-PLAN.md): actual interfaces and boundaries.
5. [Verification](verification.md) and [operations](OPERATIONS.md): recorded test results and remaining release gates.
6. [Execution plan](../PLANS.md): dated implementation progress. Its current milestones supersede the preserved historical migration plan.

## What is established, and what is not

The previous preview has working public plan/call/partner saves, separate Clerk owner admin, Neon index/status history, and isolated private Blob storage. The verified owner is bound by immutable ID and verified exact primary email. Recorded baseline evidence includes 17 API/security tests, build/typecheck, synthetic cloud persistence/reconciliation/concurrency, and owner inbox/detail/status/filter/logout checks. These results belong to the previous interface; they do not verify the redesign.

Current UX changes require fresh browser, accessibility and journey verification. Live non-owner/expired-token/revoked-token replay probes, production identity/datastore/recovery setup, manual review cadence, and visual approval remain release gates. Automatic email delivery, confirmed calendar bookings, AI drafting and customer accounts are not implemented promises.

## Provenance and guidance

The original Levarum Design System.zip checksum is `5e8c75bfc2ceb504d3eeee60470bb28d375aabd79098c0d2e0d9b25066c5b0f3`; reviewed source is retained in `design/current/`. The local extracted source is outside the repository at `../levarum-design-system/`. Older `/designs/` and Figma captures are historical. The [15-finding source audit](UI-UX-AUDIT.md) does not substitute for the current-preview audit. [Pre-redesign documents](archive/2026-09-30-pre-redesign/PROVENANCE.md) preserve previous wording and evidence.

Current editable design work: [Levarum UX redesign in Figma](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L). Its existence is not evidence of user approval or complete visual parity.

[AGENTS.md](../AGENTS.md) is a supported Codex instruction mechanism. [OpenAI AGENTS guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [frontend guidance](https://learn.chatgpt.com/use-cases/frontend-designs) inform implementation. The [ExecPlans article](https://developers.openai.com/cookbook/articles/codex_exec_plans) is an archived optional recipe; PLANS.md and this documentation structure are project conventions, not a universal OpenAI standard. [Figma file structure guidance](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/) informs component/variable/Auto Layout handoff. Specific flow and branding choices are project decisions, not OpenAI/Figma mandates.
