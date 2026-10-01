# Round 2 — simple service prototype

2026-09-30. New direction proposal following the owner's rejection of the prior visual and interaction experience. Earlier mechanical QA does not establish design quality or owner approval. This prototype has not been implemented in the application.

## Reviewable frames

Existing file, new page **06 Round 2 · Owner feedback** (`99:2`). Earlier pages are preserved.

- [Desktop Home, 1440 × 2341](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=99-6)
- [Mobile Home, 390 × 3418](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=99-101)
- [Desktop Contact, 1440 × 922](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=99-196)
- [Mobile Contact, 390 × 1196](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=99-226)

Four full native editable frames use Auto Layout, existing semantic color variables, a shared wordmark component (`99:3`) and its exact leading L as favicon (`101:18`). The L is a new native vector; the remaining lettering uses Schibsted Grotesk. This is a proposed identity, not an approved or trademark-reviewed logo.

## Decisions

The useful journey is Home → describe the work → request an email reply. Three static before/after examples communicate possibilities without a simulator or manufactured output. Three engagement steps and four visible buying answers explain the service. No quiz, task picker, print/save action, simulated controls, unsupported savings, testimonials, prices or timing claims are present. Copy follows `UX-ROUND-2-CONTENT.md`, with minor editorial shortening for layout.

Cream, ink and one rust action color replace alternating colored sections. Desktop uses a two-column introduction, three parallel examples and a side-heading FAQ. Mobile removes the secondary hero illustration and stacks content with smaller typography and tighter example spacing. The static desktop process graphic has no controls; its purpose is explanatory, not a tool. The page remains substantial because all three examples and four answers are visible; owner review should assess whether it is still too long.

## Prototype behavior and limits

Ten native reactions connect Home contact actions to the matching-width Contact frame, Contact Back to Home, and See examples to the in-page section. There are only four full-page screens. Form fields, consent and call preference are static design specifications: they do not accept input or submit data in Figma. This limitation and implementation behavior are annotated beside the frames, outside the product surface (`99:266`). Footer destinations are not included in this bounded prototype.

The default form includes required description, required email, optional call preference and required consent. The call preference is initially unchecked. The side annotation specifies revealing optional availability/timezone only when selected, explicit manual scheduling language and consent reset. Pending, recovery and durable-save receipt requirements remain in the content specification; this pass does not add duplicate frame matrices or claim those interactions tested.

Screenshots of all four compositions were inspected. Corrections addressed initial horizontal Auto Layout height sizing, header spacing, mobile illustration redundancy, mobile example density and visible link underlines. Post-correction Home desktop/mobile and Contact mobile renders were inspected. Native layout checks report the dimensions above. This is visual prototype inspection, not browser, keyboard, assistive technology or representative-user testing. Dark-mode design remains to be derived after direction review; existing semantic variables are retained but are not evidence of completed dark-mode parity.

Production remains unchanged. Application accessibility, route compatibility, private persistence, authorization and real submission flows must be rechecked after implementation. Owner visual approval is still pending.
