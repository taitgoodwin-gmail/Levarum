# Levarum working agreement

Use the AugMind cross-project delivery baseline for substantial work:
https://github.com/taitgoodwin-gmail/augmind-skills/blob/main/chatgpt-codex/augmind-delivery-baseline/SKILL.md

Before substantial product, design, engineering, AI, or release work:
1. Identify the current delivery gate: Frame, Context, Prompt, Plan, Build, Verify, Review, or Ship & Learn.
2. State the observable outcome and exit check.
3. Update an existing source of truth rather than creating a parallel plan, handoff, dashboard, or requirements document unless a genuinely new function requires one.
4. Use subagents and worktrees only when the work is substantively independent and the reconciliation path is clear.
5. Verify the actual result before claiming completion.

## Go / Continue operating instruction

When the owner says **Go**, **Continue**, or **Finish the next step** for this project, use the requirements already recorded here. Do not ask the owner to restate them or choose routine tools, commands or implementation details.

1. **Orient once per run.** Verify repository, branch/commit, dirty work, existing work key and active writer. Read the current shared baseline linked above and the project sources below; record its actual commit/blob or installed version. A link is not proof the skill was loaded. If unavailable, use an already verified version only within its known scope and disclose the limitation; block only work that depends on missing instructions.
2. **Reconcile before choosing work.** Compare the current issue, accepted decisions, code and dated evidence. Fetch/read a relevant unmerged branch when the work lives there; do not merge or overwrite a checkout just to orient. Historical machine paths, old issue SHAs and the newest timestamp alone are not authority. Read that branch's applicable instructions before editing. Reuse the existing work key/branch and ownership record when resuming; a clean checkout does not prove no other writer is active.
3. **Select and execute.** Choose the next dependency-ready, testable increment toward the documented goal. State the outcome and check briefly, then proceed within existing authorization without a routine confirmation loop. Draft requirements are proposals until accepted. For a material unresolved choice, prepare the evidence, recommendation and one focused question; continue independent safe work. Do not repeat finished work or create work merely to appear busy.
4. **Verify and persist.** Run checks appropriate to the change, repair ordinary failures within scope, and update the existing execution/evidence record. Record work key, writer, instruction version, exact code revision, checks/results, NOT RUN/BLOCKED items and next responsible actor/action. Keep private evidence private. Synchronize the existing issue only when authorized and available; disclose a failed synchronization instead of claiming it succeeded.
5. **Close the loop.** Fix a demonstrated project-specific source of rework in the existing test/instruction when in scope. Propose a shared-baseline change only for a reusable lesson, with evidence and current official guidance where behavior has changed. Do not silently change cross-project policy, add a tracker or create a recurring schedule. End with what changed, proof, remaining gates and any decision actually needed; do not leave the owner to assemble the handoff.

**Go uses the current authority; it does not expand it.** An authorization applies to the task/context that granted it, not every future task. For the initial setup trial, working-branch documentation publication is allowed; no PR, merge, release/deployment, purchase, external message, security/access change or live private-data operation is authorized. Later runs must read their applicable authorization before acting. A completed increment, passing CI, preview READY and product/owner acceptance remain separate states.

**Where are we?** means report the existing evidence and next gate; it does not start implementation. **Stop** means stop new actions and preserve a concise resume point. Go does not create a background worker or promise work after the run ends.

### Project sources for startup

- Read this checkout's [README.md](README.md) for the documented baseline and proposal status. Do not treat the proposed MVP/NFR contract as accepted scope.
- Reconcile the current **Levarum — MVP Pilot** Linear issues with GitHub. At the 3 October 2026 setup check, MIN-26 and MIN-27 carry active journey and verification context; similarly titled MIN-23/24/25 and MIN-28 require comparison before claiming or duplicating work. Do not close or reassign issues just because titles match.
- The unmerged implementation candidate found at setup is `codex/design-assessment-fixes-20261001`. Read its `AGENTS.md`, `README.md`, `PLANS.md`, `docs/REQUIREMENTS.md`, `docs/WORKFLOWS.md`, `docs/UX-REDESIGN.md` and `docs/verification.md` at the resolved current SHA. Those files are not all present on main. Recheck branch/issue evidence on the next run rather than assuming this candidate remains current.
- Use the active branch's `PLANS.md` for execution checkpoints and `docs/verification.md` for test evidence. On a checkout without those files, keep a bounded setup checkpoint in the existing README; do not create an alternative plan/requirements tree. Explicitly carry this Go instruction into the run when continuing on a branch that does not yet contain it, without overwriting that branch's own rules.
- Missing private-store/owner-session evidence is NOT RUN or BLOCKED, not a reason to submit real enquiries, expose records or alter access without authority.

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
