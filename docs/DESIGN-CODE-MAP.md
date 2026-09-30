# Design-to-code map

2026-09-30. Application reference: commit8e80f5de339cdd62bdb01cfcdb257f183cb50e87. This is an explicit source map, not a claim of pixel parity or published Code Connect metadata.

| Figma artifact | Implementation | Mapping and limits |
|---|---|---|
| [Wordmark29:25](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=29-25) | `src/ui/core/Logo.jsx`, `Logo.d.ts` | Default `shape="word"`; lowercase name; SchibstedGrotesk700;30px header,26px footer,28px owner header;−0.03em tracking. Semantic ink color follows theme. Explicit historical shape props remain compatible; other refined concept marks are not implemented. |
| [Wordmark symbol29:27](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=29-27) | `public/favicon.svg` | Native vector L geometry with light/dark palette. Not a separate React component. |
| Primary/secondary buttons2:42/2:44 | `src/styles/site.css`; native buttons/anchors in contact, explorer, partner and owner source | Figma components represent the visual role. Current application uses native semantic controls with `.lv-button`; no false mapping to an unused imported Button component. Disabled/pending/focus behavior is verified in the browser. |
| Shared field2:47 and derived QA2 field frames | `src/prospect/ContactRequest.tsx`, `src/prospect/SubmissionForm.tsx`, `src/marketing/Partners.tsx` | Editable Figma illustrations represent field hierarchy. Actual native validation, aria-describedby association, consent, pending lock and failure focus are implemented in React/HTML; the prototype does not execute those guarantees. |
| Selected task states on18:2 | `src/prospect/IntakeFlow.tsx`, `src/domain/guidance.ts`, `src/prospect/explorer.css` | Actual task ID selects editorial guidance. The responsive QA2 connected example is invoices; other existing task frames remain references. No remote assessment or personal-data submission during exploration. |
| Public shell | `src/marketing/Shell.tsx`, `src/styles/site.css` | Route anchors, native mobile disclosure, Escape restoration and persistent theme. Current Figma shell references are indexed in design QA. |
| Owner state references | `src/admin/main.tsx`, `src/admin/admin.css` | Synthetic design fixtures only. Clerk session and server authorization/storage behavior require application tests; a mock inbox is not evidence of owner access. |

Semantic color and spacing variables reuse the existing Levarum token system. Source fonts/colors take their actual values from CSS; prototype geometry is an inspected reference, not a substitute for browser reflow and interaction checks. [Design QA](REIMAGINATION-DESIGN-QA.md) records exact frame scope and remaining differences.

## Code Connect availability

The connected Figma tool was queried for published mapping suggestions on29:25. It returned: “You need a Dev or Full seat on an Organization or Enterprise plan to use Code Connect.” See [official Code Connect documentation](https://developers.figma.com/docs/code-connect/). No template or mapping was published; no upgrade, payment or new dependency was introduced. The tool did not establish publication status for the component because the account gate occurred first. This source map provides the handoff without requiring an optional paid capability for launch.
