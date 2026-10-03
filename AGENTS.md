# Levarum working agreement

Use the AugMind cross-project delivery baseline for substantial work:
https://github.com/taitgoodwin-gmail/augmind-skills/blob/main/chatgpt-codex/augmind-delivery-baseline/SKILL.md

Before substantial product, design, engineering, AI, or release work:
1. Identify the current delivery gate: Frame, Context, Prompt, Plan, Build, Verify, Review, or Ship & Learn.
2. State the observable outcome and exit check.
3. Update an existing source of truth rather than creating a parallel plan, handoff, dashboard, or requirements document unless a genuinely new function requires one.
4. Use subagents and worktrees only when the work is substantively independent and the reconciliation path is clear.
5. Verify the actual result before claiming completion.

## Levarum project overlay

- Current platform: React/Vite application deployed through Vercel. Squarespace is superseded and is not an active Levarum platform instruction.
- README.md is the current technical/product operating baseline for the public pilot. GitHub source is technical truth for implemented behavior.
- The current public pilot is evidence of implemented capability; do not silently equate it with an owner-approved final MVP. The MVP must be explicitly defined and accepted.
- Figma/design artifacts may define an approved visual target when the owner selects a specific file/frame. They do not independently redefine product scope.
- Historical Drive materials may contain valuable research, requirements, or design rationale, but any Squarespace-specific platform instruction is historical unless the owner explicitly restores it.
- Prefer updating current artifacts over generating new strategy documents.
- Preserve privacy, security, spending, publication, external-contact, and partner-claim boundaries.
- Distinguish verified implementation, proposed behavior, sample data, and untested assumptions.
- Use current primary guidance for consequential workflow decisions. The maintained OpenAI source index is:
  https://github.com/taitgoodwin-gmail/augmind-skills#official-guidance-source-index

## Code Review Rules

For repository-wide code review:
- Flag any secret, credential, private lead/customer data, or operator-only record exposed through this public repository or public route.
- Intake success must not be returned before the intended private durable write succeeds.
- Notification failure must not discard or falsely negate a successfully saved lead.
- Public/admin boundaries must remain explicit: private submissions must not become publicly readable, and disabled draft/admin paths must not silently reopen.
- A request for a conversation is not a confirmed booking. Flag wording or behavior that overstates booking, savings, ROI, timing, implementation certainty, or other unsupported outcomes.
- For retry, storage, timeout, abuse-control, data-lifecycle, recovery, and release/configuration changes, require material negative/failure-path coverage.
- For UI changes, compare against the specifically selected Figma target when one exists, including representative responsive and accessibility behavior; do not let a design draft redefine product scope.
- Do not equate CI success, deployment READY, or production availability with end-to-end MVP or real-pilot acceptance.
- Prefer bounded fixes; report unrelated findings separately rather than widening the reviewed change.

## Current execution principle

The smallest useful release should prove one complete customer-to-owner outcome with minimal owner effort. Product scope, commercial terms, and acceptance criteria must be explicit before expanding optional features.

Keep updates concise and decision-oriented. Do not make the owner project-manage the tools.
