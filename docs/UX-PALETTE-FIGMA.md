# Palette exploration in Figma

2026-09-30. Three custom palette proposals, not an approved selection. Application and original Round 2 frames remain unchanged.

New page: **07 Palette exploration · unapproved**, `103:2`, existing file `OWG4WbjbMmMILS4LKHzL6L`. [Provenance and principles annotation](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=105-50) is outside product screens. The annotation distinguishes assistant-authored hue choices from official Figma guidance and W3C criteria; it makes no color-psychology, user-research or conversion claims.

| Palette | Desktop Home | Mobile Home | Desktop Contact | Dark mobile Contact | Light/dark state boards |
|---|---|---|---|---|---|
| Cobalt & Ice | [103:29](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=103-29) | 103:124 | 103:219 | 103:249 | 103:279 / 103:311 |
| Plum & Pearl | [103:369](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=103-369) | 103:464 | 103:559 | 103:589 | 103:619 / 103:651 |
| Petrol & Citron | [103:709](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=103-709) | 103:804 | 103:899 | 103:929 | 103:959 / 103:991 |

Twelve full native editable frames and six compact state-reference boards. Identical source layouts and copy preserve a fair color comparison: Home desktop 1440×2341, Home mobile 390×3418, Contact desktop 1440×922, Contact mobile 390×1196. These dimensions match Round 2. Original prototype interactions were cleared in comparison clones so they do not jump into another palette or historical baseline. This is a static color comparison, not a working form prototype.

Three isolated variable collections (`103:3`, `103:343`, `103:683`, each prefixed `VariableCollectionId:`) contain 25 semantic variables each, Light and Dark modes. **All 150 mode values were read back from Figma and exactly matched the supplied tokens; zero mismatches.** No paid upgrade was required. Existing collections were not modified.

Roles cover canvas, surface, tint, text, muted text, controls, actions, hover, pressed, focus, disabled states, links, dividers, brand accent and labeled status feedback. The Home static illustration uses tint; logo L uses action and wordmark text uses text. Input boundaries use border. Status boards show icons/labels plus message text, not color alone. Focus includes a 2px canvas separation and 2px outside ring. Petrol's citron accent is shown explicitly on the state board and used as the dark action; light actions remain petrol for readable white labels. No token values were changed during rendering.

Screenshots inspected: all 12 full-frame compositions and all six state boards. Initial logo instances retained the old ink through inherited instance children; targeted instance overrides corrected them across all frames, with actual fill readback. Subsequent mobile/contact screenshots verify the corrected logos, including dark mode. Initial focus sample clipping was corrected and all six state boards re-rendered. Full mobile screenshots were downscaled for overview; this is not a detailed typography or browser accessibility audit.

Rendering judgment: Plum & Pearl gives a clear departure from the existing cream/rust treatment while retaining a restrained hierarchy. Cobalt makes actions more visually assertive. Petrol's light state is quieter, while citron creates the strongest dark action accent. These are visual judgments, not evidence of user preference or business outcomes. Final selection remains with the owner.

Root's role-pair luminance report is separate from the Figma variable readback. Passing token pairs does not prove every potential future placement is accessible. Form keyboard behavior, screen readers, forced colors, browser rendering, narrower widths, live states, selection approval and implementation remain outside this comparison pass.
