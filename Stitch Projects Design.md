# Design System Documentation

## 1. Overview & Creative North Star: The Academic Curator

This design system is built upon the "Academic Curator" North Star. It rejects the sterility of modern SaaS dashboards in favor of a tactile, editorial experience that feels like a well-appointed study or a high-end literary journal.

The aesthetic is driven by a **Glassmorphic Academic** approach: elements are layered with varying levels of translucency to create depth and contrast, mimicking frosted glass over warm, scholarly surfaces. We achieve a premium feel through intentional asymmetry, generous white space (defined by our 0.35rem base unit), and a sophisticated interplay between the warmth of Terracotta and the intellectual calm of the newly integrated Sage Green. Glassmorphism is applied **sparingly and purposefully** — reserved for moments where visual hierarchy and spatial separation demand it, never as a blanket treatment across all surfaces.

### Breaking the Template
To move beyond generic UI, we employ:
- **Tonal Depth:** Replacing harsh lines with shifts in surface temperature and translucency.
- **Frosted Glass Layering:** Key floating elements (modals, overlays, navigation) use glassmorphic treatments to establish clear visual hierarchy and spatial depth.
- **Editorial Typography:** High-contrast pairing of a literary serif (Newsreader) with a functional sans-serif (Work Sans).
- **Asymmetric Composition:** Content should not always center-align; use the spacing scale (e.g., `12` or `16`) to create "breathing room" that guides the eye through hierarchy rather than borders.

---

## 2. Colors: Tonal Atmosphere

The palette is rooted in earth tones and natural pigments. The introduction of **Sage Green (#8A9A8C)** acts as an intellectual counterpoint to the vibrant **Terracotta (##5D1E1B)**.

### Color Strategy
- **Primary (Deep Brownish-Red - #76312D / #5D1E1B):** Use for active energy—CTAs, primary brand moments, and critical interactions.
- **Secondary (Sage - #536256 / #D6E7D7):** Use for secondary insights, balanced accents, or "curated" content sections. It represents stability and focus.
- **Tertiary (Terracotta - #943E30 / #B35546):** Use for active energy—CTAs, primary brand moments, and critical interactions.
- **Surface & Background:** The foundation is `surface` (#F9F3F2) 
- **Primary (Deep Brownish-Red - #76312D / #5D1E1B) color shades**
    10% shades
    -----
    541b18, 4a1816, 411513, 381210, 2f0f0e, 250c0b, 1c0908, 130605, 090303

    10% tints
    -----
    6d3532, 7d4b49, 8e625f, 9e7876, ae8f8d, bea5a4, cebcbb, dfd2d1, efe9e8
- **Secondary (Sage - #536256 / #D6E7D7) color shades**
    10% shades
    -----
    7c8b7e, 6e7b70, 616c62, 535c54, 454d46, 373e38, 292e2a, 1c1f1c, 0e0f0e

    10% tints
    -----
    96a498, a1aea3, adb8af, b9c2ba, c5cdc6, d0d7d1, dce1dd, e8ebe8, f3f5f4

- **Tertiary (Terracotta - #943E30 / #B35546) color shades**
    10% shades
    -----
    a14d3f, 8f4438, 7d3c31, 6b332a, 5a2b23, 48221c, 361a15, 24110e, 120907

    10% tints
    -----
    bb6659, c2776b, ca887e, d19990, d9aaa3, e1bbb5, e8ccc8, f0ddda, f7eeed

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined through:
1. **Background Shifts:** Use `surface-container-low` for large sections resting on `surface`.
2. **Nesting:** A `surface-container-lowest` card placed inside a `surface-container-high` wrapper creates a natural, soft definition without a single line being drawn.

### Signature Textures & Glass
- **The Signature Gradient:** For hero areas or primary buttons, use a subtle linear gradient from `primary` (#943E30) to `primary_container` (#B35546). This adds "soul" and a soft, convex feel.

#### Glassmorphism Treatment
For floating modals, navigation overlays, and contextual menus — elements that need clear spatial separation from the content beneath them.

- **Base Recipe:** `surface_variant` at 70–80% opacity with a `backdrop-filter: blur(24px–40px)`. Maximize blur — especially when the glass may sit over complex backgrounds (images, dense content). Under-blurred glass looks busy and competes with the content it is meant to frame.
- **Edge Definition:** Add a low-opacity stroke (1px `outline_variant` at 15–20% opacity) and a subtle top-left gradient highlight to simulate light catching a glass edge. These strokes and gradients amplify the depth illusion, particularly over single-color backgrounds.
- **Background Pairing:** Whenever possible, place glassmorphic elements over simple or single-tone backgrounds (e.g., `surface`, `surface_container_low`). If the glass must overlay photography, illustrations, or animations, increase blur to 40px+ and raise opacity to 85%.
- **Contrast Safeguard:** Because translucent surfaces overlay unpredictable colors, always verify that text and icons on glassmorphic elements meet **WCAG AA contrast ratios** (4.5:1 for body text, 3:1 for large text/icons) across every possible background context. Use contrast-checking tools (e.g., WillowTree's Contrast plugin for Figma) to test against varied backgrounds, not just the "happy path."
- **Accessibility Escape Hatch:** Provide a user-facing setting to reduce transparency, increase contrast, or disable glassmorphic effects entirely. Respect `prefers-reduced-transparency` and `prefers-contrast: more` OS-level media queries to automatically adapt for low-vision users.
- **Judicious Use:** Glassmorphism is reserved for elements that genuinely need to float above content — modals, dropdown overlays, sticky navigation, and contextual panels. Do not apply glass effects to static cards, form containers, or body-level sections. Overuse erodes the depth illusion and creates significant accessibility and usability problems.

---

## 3. Typography: The Editorial Voice

Hierarchy is established through the tension between a high-brow serif and a modernist sans.

- **Display & Headlines (Newsreader):** These are the "headings of a manuscript." Use `display-lg` (3.5rem) with tight letter-spacing for high-impact editorial moments. The serif provides authority and history.
- **Title, Body, & Labels (Work Sans):** These are the "annotations." Work Sans provides the clarity required for digital utility. `body-md` (0.875rem) is our workhorse for legibility.
- **Styling Note:** Headlines should always utilize `on_surface` (#201A19) for maximum contrast, while secondary information uses `on_surface_variant` (#55423F) to create a "receding" effect.

---

## 4. Elevation & Depth: Tonal Layering

In this system, elevation is an optical illusion created by light and shadow, not structural lines.

### The Layering Principle
Stacking containers defines importance. 
*   **Level 0 (Base):** `surface` (#FFF8F6).
*   **Level 1 (Sub-section):** `surface_container_low` (#FDF1EE).
*   **Level 2 (Active Element):** `surface_container_highest` (#ECE0DD).

### Ambient Shadows
Shadows must be invisible but felt. When an element must "float" (like a primary card):
- **Blur:** 24px - 40px.
- **Opacity:** 4% - 6%.
- **Color:** Use a tinted shadow based on `on_surface` (e.g., `#201A19` at 5% opacity). Never use pure black or grey.

### The "Ghost Border" Fallback
If accessibility requirements demand a container edge, use a **Ghost Border**: `outline_variant` (#DBC1BC) at 15% opacity. It should be just barely perceptible.

### Glassmorphic Elevation (Floating Layer)
When an element must appear above everything (modals, popovers, sticky headers):
- **Blur:** 24px minimum, 40px+ over complex backgrounds.
- **Opacity:** 70–85% depending on background complexity.
- **Border:** 1px `outline_variant` at 15–20% opacity + subtle gradient highlight on the top/left edge.
- **Shadow:** Pair with an ambient shadow (see above) to reinforce that the glass element is spatially above the content, not merely overlapping it.

---

## 5. Components: Tactile Primitives

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text. Border-radius: `md` (0.75rem). Soft ambient shadow on hover.
- **Secondary:** `secondary_container` (#D6E7D7) fill with `on_secondary_container` (#59685C) text. This is the new Sage-based variant.
- **Tertiary:** No fill, Newsreader typeface, `surface_tint` color. Use for low-emphasis navigation.

### Cards & Lists
- **Rule:** Forbid divider lines. 
- **Execution:** Separate list items using `spacing-2` (0.7rem) of vertical white space. If separation is needed, use a subtle background shift to `surface_container_low`.
- **Corner Radius:** All cards should default to `lg` (1rem) to maintain the "Soft" aesthetic.

### Input Fields
- **Style:** Instead of a boxed outline, use a "debossed" look. Fill with `surface_container` (#F7EBE8) and a 1px `outline_variant` at 20% opacity. 
- **Focus:** Transition to a Sage Green (`secondary`) "Ghost Border" to signal an active, thoughtful state.

### Signature Component: The "Curator’s Tray"
A wide, horizontal container with `surface_container_highest` background and `xl` (1.5rem) rounded corners. Use this to group related academic resources or metadata, utilizing the new Sage Green for category chips within the tray.

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-16` (5.5rem) between major sections to emphasize the premium, airy feel.
- **Do** mix the typography: use a `headline-sm` (Serif) next to a `label-md` (Sans) to create an "annotated" look.
- **Do** use Sage Green (`secondary`) for "Success" or "Complete" states to maintain the earthy, academic tone instead of a generic bright green.

### Don’t
- **Don’t** use 100% opaque borders. It shatters the tactile, glass-like illusion.
- **Don’t** use standard "drop shadows." If it looks like a shadow, it’s too dark. It should look like "ambient occlusion."
- **Don’t** crowd the layout. If in doubt, add more white space using the `20` (7rem) spacing token.
- **Don’t** use pure white backgrounds except for the `surface_container_lowest` interior of a card. The world of this design system is warm and tinted.
- **Don’t** apply glassmorphism to every surface. Reserve it for floating, overlay, and navigational elements only. Overuse flattens the depth hierarchy and introduces contrast/readability failures.
- **Don’t** use low blur values (below 20px) over complex backgrounds — it creates a distracting, busy appearance that competes with content rather than framing it.
- **Don’t** ship glassmorphic elements without verifying text contrast across all possible background states. A translucent surface that passes contrast on one background may fail on another.


# Source
- https://www.nngroup.com/articles/glassmorphism/ 