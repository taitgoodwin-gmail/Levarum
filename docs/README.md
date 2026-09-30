# Levarum implementation handoff

> Implementation checkpoint (2026-09-29): public flows are implemented and verified in a hosted preview; private admin code is implemented but Clerk/Neon setup and live admin tests remain incomplete. Production is unchanged. [Verification](verification.md) and [operations](OPERATIONS.md) supersede historical planning-state statements below.


Status: planning baseline, 2026-09-29 America/New_York. The user supplied the current design package, requested a revised plan, and then requested documented workflows and requirements. No new design implementation or production change is part of this documentation task.

Read [implementation details](IMPLEMENTATION-DETAILS.md) for the remaining technical decisions, release gates and testing matrix. Read [requirements](REQUIREMENTS.md) for scope and observable acceptance criteria, [workflows](WORKFLOWS.md) for user/system behavior and failure paths, and the [execution plan](../PLANS.md) for milestones, progress, decisions and verification. [AGENTS.md](../AGENTS.md) carries concise repository working guidance. The existing [README](../README.md) describes the current pilot.

## Source of truth and provenance

User choice: `Levarum Design System.zip`, supplied from `/Users/tag-mba-2066/Downloads/Levarum Design System.zip`. SHA-256: `5e8c75bfc2ceb504d3eeee60470bb28d375aabd79098c0d2e0d9b25066c5b0f3`. Extracted local reference: `../levarum-design-system/` relative to the repository. This folder is outside the repository and is NOT available in a fresh clone; importing a reviewed source snapshot is milestone 1. Do not rely on its bundled SKILL.md as a separately authorized skill.

The archive has 149 entries: design tokens, brand assets, React component sources and marketing/intake/admin UI kits. Key sources: `readme.md`, `tokens/`, `components/`, `ui_kits/marketing_site/`, `ui_kits/intake/IntakeApp.jsx`, and `ui_kits/admin/AdminApp.jsx`. The kit is a visual/interaction reference, not a working production backend. `readme.md` mentions original source pages that are not in this ZIP; use the supplied kit and flag fidelity gaps rather than inventing unseen source.

User-confirmed contact: hello@levarum.com; disregard the kit's .co address. Hosting is Vercel; domain is managed through Cloudflare. Existing gallery and Figma captures contain the older designs and have not yet been updated to this ZIP.

## Guidance used

OpenAI describes AGENTS.md as durable project instructions and execution plans as living documents with observable acceptance, decisions, progress and recovery. We adopt those practices here; these filenames and the Levarum-specific requirements are project choices, not a universal ChatGPT compliance requirement.

- [OpenAI: custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [OpenAI: using PLANS.md for multi-hour problem solving](https://developers.openai.com/cookbook/articles/codex_exec_plans)

## Planning assumptions needing resolution

Email-based call requests remain the launch default; automated calendar booking is deferred unless a real provider is selected. Secure admin is confirmed for the first release. The administrator email is taitgoodwin@gmail.com; provider setup is a launch dependency. See [admin plan](ADMIN-PLAN.md). Notification delivery is not configured today: before traffic, establish and test either owner notifications or an explicit private-store review routine. Business claims, industry sources, partner terms, retention wording and numerical estimates need content review. These are requirements and pending choices, not approved service commitments.

## Design audit

[UI/UX audit](UI-UX-AUDIT.md) records 15 source/browser findings with priorities, fixes and retest criteria. It audits the supplied kit, not the currently deployed pilot.
