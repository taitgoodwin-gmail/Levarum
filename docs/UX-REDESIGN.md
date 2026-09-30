# Levarum UX correction — decisions, audit and traceability

Working baseline: 2026-09-30. Audience: small-business owners considering help with repetitive work, potential implementation partners, and the sole Levarum operator. User authorization permits changing design, flow and brand to make customer/operator tasks clearer. This is an expert/AI-assisted audit, not research with representative users. Engineering and business-analysis review reduce implementation gaps; they do not establish user preference or conversion improvement.

## Evidence and decision rules

Record observations separately from interpretations and proposed remedies. Severity: P1 obstructs a core task or produces misleading expectations; P2 adds avoidable effort or inconsistency; P3 is a minor presentation issue. Confidence reflects the observed issue, not a predicted business outcome. Each changed journey requires fresh evidence. The previous preview's 17-test/build/browser record is a regression baseline only; the expanded engineering suite now has 21 passing tests, including explicit consent, direct call without prior plan, delayed durable acknowledgement and purpose-separated deduplication. Browser redesign checks remain pending.

The [original UX01–UX15 audit](UI-UX-AUDIT.md) examined the supplied source package. Its recommendations and original “keep the visual direction” verdict remain historical. The current findings below concern the implemented preview and source. Do not mark the source-package findings closed merely because the new interface looks different; use their acceptance evidence in [verification](verification.md).

## Current-preview audit

| ID / priority | Observed evidence and affected task | Principle and consequence | Remedy / acceptance | Confidence / state |
|---|---|---|---|---|
| CX01 / P1 | Intake promises three questions but uses seven states, an explanatory interstitial and email gate. W02 prospect wants useful guidance. | Match expectations; minimize unnecessary steps. Unannounced contact barrier interrupts the promised outcome. | One questionnaire → guidance before contact; no POST, email or consent required to reach guidance. | High observation; new browser proof pending. |
| CX02 / P1 | Result cards repeat a generic instruction; selected[0] determines the proposed first task from catalog order. | Honest explanation and relevance. Implies prioritization unsupported by collected evidence. | Distinct approach/checks/boundaries per task; label user-selected starting points without inferred ranking. | High source evidence; content review/verification pending. |
| CX03 / P2 | Mobile header occupies multiple rows and uses a vague Start action. W01 orientation/entry. | Clear hierarchy, recognition and efficient use of space. Competing links obscure next action. | Compact labeled menu, consistent primary CTA and keyboard/expanded-state tests at 320/390px. | High observed layout; redesign check pending. |
| CX04 / P2 | Marketing, custom intake and owner surfaces use inconsistent control/layout conventions. | Consistency and predictable behavior. Users must relearn similar interactions. | Shared foundations/components; public flow and operational admin each use task-appropriate hierarchy. | High; cross-screen comparison pending. |
| CX05 / P2 | Half-dome/bar logo does not clearly convey its coded lever explanation; owner finds it underwhelming. | Brand legibility/distinctiveness is a design judgment, not a standards failure. | Compare three directions in header/mobile/favicon contexts; document selected rationale and small-size/theme checks. | High owner feedback; preference not measured. |
| CX06 / P1 | Home includes hypothetical 9h/4h/3h/2h meter examples while guidance deliberately avoids numeric promises. | Credible, consistent content. Illustrative quantities can imply substantiated customer outcomes. | Replace with qualitative concrete examples; no numerical benefit claims or invented proof. | High source finding; final copy check pending. |
| CX07 / P2 | Metaphorical headings, branded Game Plan terminology and repeated examples compete with a concrete service explanation. | Plain language and information hierarchy. Additional interpretation delays understanding. | Explain who Levarum helps, what work changes and what happens next; consistent starting-point/follow-up terms. | Medium expert assessment; real-user comprehension untested. |
| CX08 / P2 | Admin details display raw field/pain IDs; inbox heading is metaphorical and reconciliation uses internal language. W05 operator triage. | Recognition and actionable system feedback. Interpretation slows repeated operations. | Requests heading, human-readable details/type labels, clear status/sync outcomes without pretending email/calendar automation. | High source evidence; fresh owner check pending. |
| CX09 / P1 | Docs call deployed partner API nonexistent and provisioned admin proposed; earlier status checkboxes conflict with later evidence. | Traceable requirements and accurate system documentation. Stale instructions risk duplicate work or regression. | Archive exact previous text; current docs use actual contracts and dated evidence, outstanding gates explicit. | High; reconciled documentation, link/diff review required. |

## Intake alternatives evaluated before implementation

| Criterion | A — Short questionnaire then contact gate | B — Short questionnaire then guidance, optional contact |
|---|---|---|
| Clarity | Must announce email requirement before starting; mixes learning with lead capture. | Provides the promised informational outcome first; separate clear decision to contact. |
| Effort | Shorter than old seven-state flow, but all visitors must supply contact details. | Core result uses only the necessary context/task choices; contact is optional. |
| Usefulness | Same guidance remains hidden until a request is saved. | Visitor can evaluate, edit and print advice without creating a lead. |
| Consent transparency | Can be lawful/explicit, but required consent is coupled to seeing generic guidance. | Storage/contact consent accompanies an intentional follow-up request. |
| Operator impact | Captures more addresses in principle but interest quality is unknown. | Saves only intentional contacts; volume/conversion effect is unknown. |

**Decision B:** questionnaire → useful local guidance → optional email follow-up or call → durable receipt. This is an expert product decision supported by the user's friction-reduction goal, not an experimentally proven conversion improvement. No new API is required. Existing intent plan is displayed as follow-up request; call retains scheduling-request semantics. Switching contact purpose must present the matching explanation and require fresh explicit consent. Guidance selection is task-based; business/hours provide context but do not justify individualized numeric estimates.

## Design artifacts and review

[Figma working file](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L) is the editable design handoff. The implementation lead reports native wireframes, a three-direction logo comparison and the selected prototype frames below. Expert selection supports implementation under the user’s broad authorization; owner visual approval and final browser parity remain pending.

| Artifact | Figma reference / decision |
|---|---|
| Intake wireframes | [Comparison page 2:51](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=2-51); B selected using the evaluation above. |
| Three logo directions | [Comparison page 2:52](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=2-52); selected [Lift component 4:2](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=4-2). Selection is a brand judgment favoring a clear compact mark while preserving warmth, not measured user preference. Validate header/mobile/favicon legibility in browser. |
| Home | [Desktop 6:2](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=6-2), [mobile 6:46](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=6-46). |
| Intake | [Questionnaire 6:88](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=6-88), [guidance 6:112](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=6-112). |
| Follow-up | [Contact 6:137](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=6-137), [receipt 6:159](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=6-159). |
| Operator | [Inbox 6:173](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=6-173); private operational details remain governed by admin acceptance criteria. |

Components, variables, responsive layout and interaction annotations are handoff requirements. Recorded frame existence does not prove all states, themes or accessibility behavior are represented. Browser comparisons must note any intentional divergence and remaining frame coverage.

## Coordinated senior-role review

| Role | Observed finding | Decision / hypothesis | Evidence boundary |
|---|---|---|---|
| Business analysis | Documentation contradicted deployed APIs/provider state and lacked unified requirements-to-task mapping. | Current baseline now links each requirement to need, workflow, screen/state, contract and acceptance. Optional contact separates an informational need from a sales enquiry. | Documentation reconciliation is observable; improved lead quality or conversion is not measured. |
| UI/UX | Surprise gate, generic advice, hypothetical hour figures, crowded navigation, inconsistent copy/control patterns and raw admin labels. | Select B, task-specific starting points, plain navigation/copy, shared foundations and Lift brand direction. | Expert/AI-assisted review; real-user comprehension and logo preference remain untested. |
| Engineering | Existing endpoints support direct call and follow-up saves; private admin authorization/index/history need no redesign-driven schema change. | Preserve interfaces, enforce purpose-specific consent and receipts, verify no network save before optional contact. | Expanded 21-test suite passed; browser states/security probes have their own outstanding acceptance. |

The team roles are coordinated AI agents, not an assertion that independent human professionals or representative users participated. [Current execution plan](../PLANS.md) records decisions, progress and remaining gates.

## Requirements-to-journey traceability

Status vocabulary: **baseline passed** refers only to previous recorded implementation; **target** requires current implementation/verification; **gate** blocks production. Test identifiers below are acceptance scenarios, not an assertion that an automated test with that filename exists.

| Requirement | User need / journey | Screen and states | Interface | Acceptance scenario | Current evidence/status |
|---|---|---|---|---|---|
| R01 | Recognize one coherent service; W01/W05 | Public shell, controls, logo; admin foundations; both themes | None | V01 compare Figma/components and logo contexts at mobile/desktop | Design frames selected; final browser comparison pending |
| R02 | Understand offer and navigate; W01 | All public routes; compact menu open/closed; 404 | Existing routes | V02 direct load/refresh/Back/menu keyboard/primary-action clarity | Routes baseline passed; changed navigation target |
| R03 | Get advice without forced contact; W02 | Questionnaire invalid/valid; guidance; edit | No POST for guidance | V03 complete with no email/consent/save; edit retains choices | New target; browser evidence pending |
| R04 | Know whether intentional contact saved; W03 | Contact invalid/pending/failed/saved | POST /api/leads | V04 consent, stable retry, delayed ack, exact private retrieval | 21-test suite includes new consent/durable tests; browser rerun pending |
| R05 | Receive relevant next steps; W02 | One guidance item per selected task | Local public task data | V05 every task has distinct checks/boundaries; no arbitrary ranking | New target |
| R06 | Trust claims; W01/W02 | Marketing examples and guidance | No estimator | V06 no numeric savings/unsupported percentages; all task/band choices coherent | Qualitative baseline; Home content correction target |
| R07 | Request a conversation without believing booked; W03/W05 | Call contact/receipt; call status action | POST leads intent call; admin status | V07 direct call without prior plan; purpose-specific fresh consent; unbooked receipt | Direct-call API test passed; new browser receipt target |
| R08 | Express collaboration interest; W04 | Partner invalid/pending/error/saved/reset | POST /api/partners | V08 synthetic private save and failure/retry/consent | Baseline passed; copy/style rerun pending |
| R09 | Retrieve and act on saved requests; W05 | Inbox/filter/detail/sync/empty/error | /api/admin list/detail/sync/status | V09 synthetic types visible; index reconciliation; human intent labels | Storage/owner baseline passed; relabeling target; review cadence gate |
| R10 | Make an informed privacy/contact choice; W03/W04/W06 | Consent, privacy, receipts | Public save contracts | V10 no automatic-email claim, no PII in public artifacts, correct contact | Baseline protections; copy/fresh consent target; retention operations gate |
| R11 | Keep customer data private; W05 | Sign-in/denied/expired/logout; separate entries | Owner auth on every admin action | V11 boundary + direct API denials + session revocation | Baseline tests passed; live negative/replay probes gate |
| R12 | Complete tasks on small screens/keyboard; all | Public/admin, light/dark, focus/error/motion states | None | V12 320/390/768/1440, keyboard, contrast, theme, reduced motion; separate AT report | Previous browser/axe baseline; redesign and real AT checks pending |
| R13 | Reliable safe operation; W03–W07 | Direct routes; API error/retry states | Existing protected contracts | V13 build/typecheck/security/API tests, exact persistence | Baseline passed; final rerun required |
| R14 | Review a concrete coherent result; W07 | Figma prototype and deployed preview | Preview deployment only | V14 artifact/frame/commit references, browser comparison, owner review | Figma alternatives/frames selected; preview comparison and owner review gate |

Admin A01–A08 status and remaining production gates are maintained in [ADMIN-PLAN.md](ADMIN-PLAN.md); [WORKFLOWS.md](WORKFLOWS.md) describes recovery and [verification](verification.md) holds dated results. Evidence must be updated when a test is actually run, not inferred from another journey or an earlier deployment.

## Authorities, limits and open evidence

- [OpenAI AGENTS.md guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md): repository instruction discovery. This document architecture is a Levarum choice.
- [OpenAI frontend workflow](https://learn.chatgpt.com/use-cases/frontend-designs): concrete references, shared components and browser comparison. Build success is not visual acceptance.
- [Figma file structure](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/) and [Code Connect](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/): meaningful components/variables/layout and links to real implementation; not a guarantee that the chosen experience meets user needs.
- [Figma user flows](https://www.figma.com/resource-library/user-flow/) and [usability testing](https://www.figma.com/resource-library/usability-testing/): task/decision modeling and testing prototypes with users. AI expert walkthroughs here are not representative-user tests.
- [OpenAI ExecPlans](https://developers.openai.com/cookbook/articles/codex_exec_plans) is an archived optional recipe; its use is a project convention.

Still missing from a complete expertise review: representative owner/partner/operator interviews or task tests; measured comprehension/success/time/error evidence; actual screen-reader sessions; production account/recovery/backup checks; final visual approval. No ISO, WCAG, OpenAI or Figma certification is claimed. Accessibility checks must state exactly what was tested. The team may improve the interface now without presenting these unknowns as verified.
