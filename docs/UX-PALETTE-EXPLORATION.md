# Levarum — new palette exploration

2026-09-30. Design proposal; no palette is approved or implemented. This responds to the owner’s request for an entirely new palette after rejecting the previous UI/UX. The current cream/rust system remains a comparison, not a constraint.

## What the palette must accomplish

Levarum is a practical automation service for small businesses, not an interactive assessment or a software dashboard sold to visitors. Color should make the primary contact action easy to find, keep long explanations readable, distinguish fields from decoration, and support the private operator interface without implying that marketing examples are working tools. A new hue does not repair an unclear offer or unnecessary interactions; the simplified Round2 journey remains the foundation.

The comparison keeps layout, words, typography and logo shape constant. That makes differences attributable to color rather than quietly making one option’s design better. Every direction changes canvas, raised surfaces, section tints, text, muted text, functional boundaries, links, primary/hover/pressed actions, focus, decorative accent and feedback states. Dark mode is separately tuned, not an automatic inversion.

## Three coherent alternatives

| Direction | Light foundation / action / ink | Why consider it | Why it might be wrong |
|---|---|---|---|
| **Cobalt & Ice** | `#F6F8FC` / `#2454D6` / `#18243B` | Cool near-white surfaces and an unmistakable saturated action color give the simple service layout a precise technical character. Blue action color stays separate from green success and red error roles. | Familiar technology styling can become anonymous. Large blue panels or excessive saturation would push it toward generic software branding. Its technical character is an aesthetic judgment, not proof of trust or conversion. |
| **Plum & Pearl** | `#FAF7FB` / `#753D83` / `#2D2035` | A substantial departure from rust/cream. Violet-black typography and pale lilac surfaces give the wordmark, editorial hierarchy and controls one coherent family. It can retain a softer service presentation without returning to brown/beige. | Overusing violet or pastel panels can look ornamental and compete with the practical offer. Keep most reading surfaces nearly neutral; reserve the saturated shade for real actions and small identity details. |
| **Petrol & Citron** | `#F4F8F5` / `#17645D` / `#123B3D`; accent `#DDEB78` | Deep green-blue creates a strong ink color; citron supplies a sharply different accent. Mineral surfaces and restrained yellow-green details offer the most energetic contrast among these proposals. | Green branding can overlap with success meaning or suggest another category. Never use brand green alone to indicate success. Citron is not suitable with white small text; use the specified dark foreground. Avoid decorative highlighter overload. |

**Initial recommendation: explore Plum & Pearl first**, with Cobalt & Ice as the clarity benchmark and Petrol & Citron as the more expressive challenger. This is a design judgment against the requested departure and warm, approachable brief—not a market uniqueness, psychological or performance finding. Final preference should be assessed on the full screens, especially the mobile page and contact form, rather than a swatch row.

## Role and use rules

- **Canvas / surface / tint:** canvas carries the page; surface is a raised or input surface; tint groups related content. Do not fill every section with a different hue.
- **Text / muted:** body and secondary copy remain comfortably legible. Muted is not disabled; helper text still matters.
- **Action / hover / pressed / onAction:** one action family for the primary next step. Text color belongs to the background role; it is not globally white. Links use an underline as well as color.
- **Border / divider:** functional boundaries identify fields and checkboxes. Decorative separators use a quieter separate token and carry no essential meaning.
- **Focus:** an illustrative2px canvas-colored separation plus2px focus ring separates focus from a similarly colored button. Actual browser geometry/visibility still needs testing; palette ratios do not certify focus behavior.
- **Accent:** decorative identity only where useful. In Petrol light mode, citron uses dark ink and is not a second competing primary action. In dark mode it becomes the high-contrast primary fill.
- **Feedback:** error, success, warning and information have foreground/surface pairs, visible labels and accompanying symbols. No state is communicated by hue alone. Disabled text/surface also has a defined pair; disabling must still use actual semantics in code.
- **Dark mode:** use darker chromatic surfaces, light text and lighter action fills with dark labels. Do not carry a dark light-mode button into dark mode and assume it is visible.

## Measured contrast, not an accessibility claim

The supplied token values were checked with the WCAG relative-luminance formula, using unrounded comparisons. The set includes body/muted/link/action text on intended reading surfaces, button labels in default/hover/pressed states, input/focus boundaries, accent labels, disabled labels and feedback text. All150 enumerated combinations meet the selected threshold; some are aliases, not150 independent design findings. Normal text is checked at4.5:1 even where larger text could qualify for3:1. Functional boundaries are checked at3:1; purely decorative dividers are excluded from that claim.

| Direction | Light body / canvas | Light button label / fill | Dark body / canvas | Dark button label / fill |
|---|---:|---:|---:|---:|
| Cobalt & Ice |14.58:1|6.34:1|16.43:1|8.68:1|
| Plum & Pearl |14.43:1|7.63:1|16.08:1|8.71:1|
| Petrol & Citron |11.40:1|6.96:1|14.43:1|9.96:1|

These are token-pair calculations, not proof that every rendered component uses the right pair. Figma readback and visual inspection are separate; actual CSS/browser states, focus, assistive technology, color-vision experience and user preference remain to be tested after selection. No screen-reader, conversion or full WCAG conformance result is claimed.

## Sources and why they apply

- [W3C: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) supplies the text contrast thresholds and luminance calculation basis. It constrains legibility, not the brand’s hue. Logos are formally excepted, but Levarum’s wordmark should remain legible in practice.
- [W3C: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) informs essential control/state boundaries. It does not require every decorative rule or section background to meet3:1.
- [W3C: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) supports visible text/shape cues alongside hue. This is particularly relevant when brand green and a success color coexist.
- [Figma: Tokens, variables and styles](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles) informs named color roles and theme modes so the same role can use a different value in light/dark contexts. It does not prescribe any of these palettes or establish that a hue will persuade users.

No GOV.UK guidance, generic color-psychology claims or unsupported competitor differentiation is used. Lighthouse cannot select a brand palette; automated contrast findings are one input to design review.

## Review and next step

Compare the same Home, mobile Home and Contact composition in all three systems; inspect the dark contact and feedback specimens. Pick a direction based on visual fit and action hierarchy, then refine that one system across public, partner and owner screens and implement its semantic CSS tokens. Preserve consent, truthful saving, error recovery and owner authorization. The site remains unchanged during this exploration.

All exact light/dark role values and enumerated calculations accompany this proposal. The Figma comparison is complete:

- [Cobalt & Ice](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=103-29)
- [Plum & Pearl](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=103-369)
- [Petrol & Citron](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=103-709)
- [Visible provenance and sources](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=105-50)

Twelve full frames and six state boards were visually inspected. All 150 stored Figma token values matched the proposed values; these are distinct from the foreground/background contrast calculations above. Inherited black logo fills and clipped focus specimens were corrected. These are static color comparisons: cloned navigation reactions were cleared to prevent cross-palette navigation. No application changes or approval are implied. Detailed canvas evidence is recorded in UX-PALETTE-FIGMA.md.

## Provenance: where the colors actually came from

The exact HEX values were hand-selected by the assistant as three contrasting design hypotheses, then checked computationally for intended foreground/background contrast. They were **not** copied from a Figma-recommended Levarum palette, sampled from a competitor/photo, generated with Figma’s palette generator, or derived from audience preference research. The references below explain and constrain the design method; they do not prove that these particular hues are the best business choice. Additional Figma palette/hierarchy guidance was checked against the proposed candidates after the initial hue selection rather than retrospectively presented as the source of their HEX values.

| Candidate | Construction and provenance | What this establishes | What it does not establish |
|---|---|---|---|
| Cobalt & Ice | Chosen action `#2454D6` has HSL hue223.8°. Canvas220° and primary ink219.4° form a closely related blue tonal family, varying lightness/saturation by role. | A coherent family and a large lightness difference between reading surfaces, text and actions. | That blue produces trust or that software buyers prefer it. This is a tonal-family approach, not a claim that every role has an identical hue. |
| Plum & Pearl | Chosen action `#753D83` has hue288°. Canvas285° and ink277.1° stay in a neighboring violet family, with very low-saturation reading surfaces. | A coherent alternative substantially different from the prior rust accent; action fills remain darker than the page. | That violet is inherently premium, culturally universal or uniquely recognizable in this market. |
| Petrol & Citron | Chosen petrol action hue174.5° and ink182.8° pair with citron67.3°. The accent differs in both hue and luminance. | A deliberately contrasting accent rather than a second unrelated action family. | This is **not** a strict complementary pair: the hues are not180° apart. Nor is it evidence of sustainability or financial expertise. |

Hue measurements use ordinary HSL from the authored sRGB HEX values. They describe the construction; perceptual harmony is not determined by hue angles alone.

## Source → principle → actual decision

| Principle | Direct source | Application here | Boundary / critical judgment |
|---|---|---|---|
| Visual hierarchy | [Figma: Visual hierarchy](https://www.figma.com/resource-library/what-is-visual-hierarchy/) | Reserve the strongest filled color treatment for the main contact action. Keep reading surfaces quiet; distinguish text importance through luminance plus typography. | Figma explains attention/order. It does not mandate blue, purple, green or a specific color ratio. |
| Consistency | [Figma: UI design principles](https://www.figma.com/resource-library/ui-design-principles/) | The same action color/label treatment means the same kind of action across Home and Contact. Keep border, feedback and decorative roles distinct. | Consistent controls still need useful behavior. Color does not justify reinstating the rejected simulator/print controls. |
| Hue family, value and saturation | [Figma: Types of color palettes](https://www.figma.com/resource-library/types-of-color-palettes/) | Explore related-tone systems and a contrasting-accent system; vary value/saturation to obtain readable roles. Compare in context and solicit feedback. | The article presents palette families and heuristics, not a validated Levarum selection. Its60/30/10 suggestion is not treated as a mandatory pixel quota. Its general color-association claims are not used as proof of this audience’s response. |
| Semantic roles and themes | [Figma: Tokens, variables and styles](https://help.figma.com/hc/en-us/articles/18490793776023-Update-1-Tokens-variables-and-styles) | Define text, surface, action, focus and feedback roles; assign separate Light/Dark values using isolated Figma collections/modes. | This is maintainable system architecture. It does not by itself make a palette visually good. |
| Text and control legibility | [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | Check intended text pairs against4.5:1 and essential boundaries against3:1; choose correct button foreground for each mode. | Contrast is measurable; whole-interface accessibility and focus geometry still need rendered checks. Decorative dividers are not essential-control boundaries. |
| Meaning beyond hue | [W3C: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Keep visible error/success labels and symbols, underlined links, real checkbox indicators and a visible focus shape. | Passing a contrast ratio does not make red-versus-green state meaning sufficient by itself. |

The unresolved research is audience/owner preference and real brand differentiation—not basic token readability. Therefore the result is a justified shortlist for review, not a claim of a research-proven winning palette. My initial Plum recommendation remains provisional.
