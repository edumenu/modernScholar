# Design System Documentation

## 1. Overview & Creative North Star: The Academic Curator

This design system is built upon the "Academic Curator" North Star. It rejects the sterility of modern SaaS dashboards in favor of a tactile, editorial experience that feels like a well-appointed study or a high-end literary journal.

The aesthetic is driven by a **Glassmorphic Academic** approach: elements are layered with varying levels of translucency to create depth and contrast, mimicking frosted glass over warm, scholarly surfaces. We achieve a premium feel through intentional asymmetry, generous white space (defined by our 0.35rem base unit), and a sophisticated interplay between the warmth of Terracotta and the intellectual calm of the newly integrated Sage Green. Glassmorphism is applied **sparingly and purposefully** — reserved for moments where visual hierarchy and spatial separation demand it, never as a blanket treatment across all surfaces.

### Breaking the Template
To move beyond generic UI, we employ:
- **Tonal Depth:** Replacing harsh lines with shifts in surface temperature and translucency.
- **Frosted Glass Layering:** Key floating elements (modals, overlays, navigation) use glassmorphic treatments to establish clear visual hierarchy and spatial depth.
- **Editorial Typography:** High-contrast pairing of a literary serif (Noto Serif) with a functional sans-serif (Poppins).
- **Asymmetric Composition:** Content should not always center-align; use the spacing scale (e.g., `12` or `16`) to create "breathing room" that guides the eye through hierarchy rather than borders.

---

## 2. Colors: Tonal Atmosphere

The palette is rooted in earth tones and natural pigments. The introduction of **Sage Green (#8A9A8C)** acts as an intellectual counterpoint to the vibrant **Terracotta (#5D1E1B)**.

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

---

## 3. Glassmorphism: Principles, Recipes & Best Practices

Glassmorphism is a visual-design style that utilizes different levels of translucency to create depth and contrast between foreground and background elements, mimicking frosted glass. In major design systems it is categorized as a "material" — Microsoft's Fluent Design calls it "Acrylic," Apple's visionOS and iOS 26 use SwiftUI translucent materials throughout.

The effect only works when there is something behind the glass. Without a visible background — whether a gradient, image, or tonal surface — the translucent panel looks like a flat, washed-out rectangle. The entire point is **layered spatial hierarchy**, not decoration.

### 3.1 Core Properties

Every glassmorphic element is built from four properties working together:

| Property | Role | CSS |
|---|---|---|
| **Opacity** | Controls how much background shows through. Lower opacity = more transparency = stronger glass illusion. | `background: rgba(R, G, B, 0.10–0.30)` or use our surface tokens at reduced alpha |
| **Background Blur** | Distorts what sits behind the panel, creating the "frosted" look. This is the signature property. | `backdrop-filter: blur(Xpx)` |
| **Stroke / Border** | A low-opacity or gradient border simulates the thickness of real glass catching light at its edge. | `border: 1px solid rgba(...)` with gradient overlay |
| **Fill Gradient** | A subtle directional gradient on the panel itself mimics light reflecting off a curved glass surface. | `background: linear-gradient(135deg, rgba(..., 0.15), rgba(..., 0.05))` |

### 3.2 Blur Calibration

Blur is the most critical variable. Too little and the background shows through distractingly; too much and the panel becomes opaque and loses the glass metaphor.

| Background Type | Recommended Blur | Opacity Range | Notes |
|---|---|---|---|
| **Simple / single-tone** (our `surface`, `surface_container_low`) | 16–24px | 60–75% | Lower blur is acceptable because the background is uniform — there is little to distract |
| **Moderate complexity** (illustrations, subtle patterns, UI content) | 24–40px | 70–80% | Our default range for most floating elements |
| **High complexity** (photography, video, dense content, animations) | 40–80px | 80–90% | Maximize blur to prevent the background from competing with foreground text. Raise opacity as needed |

**Rule of thumb from NN/g:** "More blur is better." When in doubt, increase blur rather than decrease it. An over-blurred panel still reads as glass; an under-blurred panel looks broken.

### 3.3 The Academic Curator Recipe

Our glassmorphic treatment is tuned to the warm, earthy palette of this system. We do not use the cool blues, purples, or neon gradients common in generic glassmorphism — our glass is warm, scholarly, and grounded.

#### Base Glass (Modals, Dropdowns, Contextual Panels)
```html
<!-- Warm tinted fill (surface_variant at ~72%), frosted blur, ghost stroke, ambient tinted shadow -->
<div class="bg-[rgba(236,224,221,0.72)] backdrop-blur-[32px] border border-[rgba(219,193,188,0.18)] shadow-[0_8px_32px_rgba(32,26,25,0.05)] rounded-lg">
  ...
</div>
```
> **Note:** The `border-image` gradient highlight (`135deg, rgba(255,255,255,0.12) → rgba(219,193,188,0.06)`) cannot be expressed as a Tailwind utility. Apply it via a custom class in `globals.css` if needed, or use a pseudo-element overlay.

#### Elevated Glass (Sticky Headers, Navigation Overlays)
```html
<!-- Surface at ~78%, heavier blur + saturate, bottom ghost stroke, inset highlight + ambient shadow -->
<div class="bg-[rgba(249,243,242,0.78)] backdrop-blur-2xl backdrop-saturate-[1.2] border-b border-[rgba(219,193,188,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_4px_24px_rgba(32,26,25,0.04)]">
  ...
</div>
```

#### Heavy Glass (Over Photography / Complex Backgrounds)
```html
<!-- Surface at ~88%, maximum blur + slight saturate, ghost stroke, deeper ambient shadow -->
<div class="bg-[rgba(249,243,242,0.88)] backdrop-blur-3xl backdrop-saturate-[1.1] border border-[rgba(219,193,188,0.15)] shadow-[0_12px_48px_rgba(32,26,25,0.06)]">
  ...
</div>
```

### 3.4 Depth & Layering with Glass

Glass only creates spatial hierarchy when layers are clearly ordered. Follow these rules:

1. **Z-order is non-negotiable.** Every glassmorphic element must sit at a defined elevation tier. Glass on the same plane as its background destroys the illusion.
2. **One light direction.** Maintain a single, consistent light source (top-left in this system) across all glass panels. The top-left gradient highlight and bottom-right ambient shadow must agree.
3. **Shadow reinforces separation.** Always pair glass with an ambient tinted shadow. Without it, the panel looks overlapping rather than floating.
4. **Parallax amplifies depth.** Where appropriate, subtle motion differences between the glass panel and its background (on scroll or drag) reinforce the spatial separation.

#### Layering Model
```
Z-5  ──  Tooltips, Toasts         (glass-heavy, blur 40px+)
Z-4  ──  Modals, Dialogs          (glass-panel, blur 32px)
Z-3  ──  Dropdowns, Popovers      (glass-panel, blur 24–32px)
Z-2  ──  Sticky Nav, Floating Bar (glass-elevated, blur 40px)
Z-1  ──  Cards, Containers        (NO glass — use tonal layering)
Z-0  ──  Page Surface             (solid surface token)
```

**Critical:** Z-1 and below must never use glassmorphism. Cards and body-level sections use tonal surface shifts (Section 4), not translucency. Glass is exclusively for Z-2 and above.

### 3.5 Accessibility & Contrast

Glassmorphic surfaces overlay unpredictable colors. This is the #1 source of accessibility failures in glass-based designs.

#### Mandatory Checks
- **WCAG AA Contrast:** 4.5:1 for body text (under 18px / 14px bold), 3:1 for large text and icons.
- **Multi-background testing:** Verify contrast not just on the "happy path" background, but across every possible background the element may appear over. Use tools like WillowTree's Contrast plugin for Figma, or test programmatically by sampling contrast at multiple viewport positions.
- **Semi-opaque text backing:** When text sits on a glass panel, consider adding a subtle semi-opaque fill behind the text area (`rgba(249, 243, 242, 0.4)`) as a contrast safety net — invisible in most contexts but protective in edge cases.

#### OS-Level Adaptations

Add the following to `globals.css` using Tailwind v4's `@utility` or `@layer` directives to handle reduced-transparency and high-contrast preferences:

```css
/* In globals.css — solid fallbacks for accessibility preferences */
@layer utilities {
  @media (prefers-reduced-transparency: reduce) {
    .glass-panel,
    .glass-elevated,
    .glass-heavy {
      @apply bg-(--surface-container-highest) backdrop-blur-none border border-[rgba(219,193,188,0.25)] shadow-none;
    }
  }

  @media (prefers-contrast: more) {
    .glass-panel,
    .glass-elevated,
    .glass-heavy {
      @apply bg-(--surface) backdrop-blur-none border border-(--outline-variant) shadow-none;
    }
  }
}
```
> **Why CSS here:** Tailwind v4 does not yet provide built-in variants for `prefers-reduced-transparency` or `prefers-contrast`. These media queries must live in `globals.css` as `@layer` overrides. Consider registering custom variants if these are used frequently.

#### User-Facing Transparency Toggle
Provide an in-app setting to reduce or disable glass effects entirely. Not all users have OS-level preferences configured, and some may prefer a solid aesthetic for readability or performance reasons.

### 3.6 Light & Dark Theme Adaptation

Glass behaves differently across themes. A treatment tuned for light mode may look washed-out or too opaque in dark mode.

| Property | Light Mode | Dark Mode |
|---|---|---|
| **Fill base** | `surface` / `surface_variant` at 70–80% | `surface_container` at 60–70% (darker fills need lower opacity to maintain the glass illusion) |
| **Blur** | 24–40px | 24–40px (same range) |
| **Border** | `outline_variant` at 15–20% | `rgba(255, 255, 255, 0.08–0.12)` (light edge on dark glass) |
| **Shadow** | `on_surface` at 4–6% | `rgba(0, 0, 0, 0.15–0.25)` (shadows must be stronger against dark surfaces to register) |
| **Gradient highlight** | Top-left `rgba(255,255,255,0.10–0.15)` | Top-left `rgba(255,255,255,0.04–0.08)` (subtler to avoid looking "painted on") |

### 3.7 Performance & Mobile

Backdrop blur is GPU-composited but still expensive. On lower-end hardware or older browsers it can cause jank, especially when multiple blurred layers overlap or animate.

#### Performance Rules
1. **Limit concurrent blurred elements.** No more than 2–3 glassmorphic elements visible simultaneously. If a modal opens over a sticky glass header, consider temporarily removing the header's blur.
2. **Never animate the blur value itself.** Transitioning `backdrop-filter: blur(0px)` to `blur(32px)` is extremely expensive. Instead, animate opacity on a pre-blurred element, or crossfade between a solid and a blurred state.
3. **Use `will-change: backdrop-filter` sparingly.** Only apply to elements that will be shown/hidden, not to persistent UI.
4. **Hardware acceleration.** Apply `transform: translateZ(0)` or `will-change: transform` to the glass element to promote it to its own compositor layer, reducing repaints on the layers beneath it.
5. **Feature detection & graceful fallback.** Not all browsers support `backdrop-filter`. Provide a solid fallback:
```css
/* In globals.css — fallback for browsers without backdrop-filter support */
@layer utilities {
  @supports not (backdrop-filter: blur(1px)) {
    .glass-panel,
    .glass-elevated,
    .glass-heavy {
      @apply bg-(--surface-container-highest) backdrop-blur-none border border-[rgba(219,193,188,0.20)];
    }
  }
}
```
> **Note:** `@supports` queries cannot be expressed as Tailwind utilities. Keep this fallback in `globals.css`.
6. **Mobile caution.** On mobile, reduce blur values by ~30% and limit glass elements to the primary floating layer only (e.g., bottom sheet or modal — not both plus a header).

### 3.8 Where Glass Lives (and Where It Does Not)

| Element | Glass? | Why |
|---|---|---|
| Modals / Dialogs | Yes | Floats above content, glass reinforces spatial separation |
| Dropdown Menus / Popovers | Yes | Contextual overlays benefit from glass depth |
| Sticky Navigation / Header | Yes | Maintains content visibility while scrolling |
| Command Palette / Search Overlay | Yes | Premium "spotlight" feel, floats above everything |
| Tooltip / Toast | Yes (light) | Brief floating elements; use glass-heavy with high blur |
| **Sidebar / Permanent Navigation** | **No** | Persistent elements should use solid surface tokens. Glass on a sidebar causes constant GPU compositing and blurs distracting content |
| **Cards** | **No** | Use tonal surface layering (Section 4). Glass on cards is the most common glassmorphism misuse |
| **Form Containers** | **No** | Inputs need stable, high-contrast backgrounds for usability |
| **Page Sections** | **No** | Body-level layout uses solid surfaces. Glass at this scale is visually noisy and performance-heavy |
| **Static Lists / Tables** | **No** | Dense content needs maximum readability, not translucency |

### 3.9 Common Mistakes

1. **Blur too low over busy backgrounds.** The background shows through and competes with the content. Fix: increase blur to 40px+ or simplify the background.
2. **Glass everywhere.** Applying glass to cards, sections, and navigation simultaneously flattens the depth hierarchy — everything looks like it's at the same elevation. Fix: reserve glass for Z-2+ only.
3. **Ignoring the background.** Glass is a *relationship* between foreground and background. A glassmorphic panel over a plain white background looks like a slightly grey rectangle, not glass. Fix: ensure the background has enough visual content (gradient, tonal shift, imagery) for the blur to act upon.
4. **Low-contrast text.** The translucent fill shifts color depending on what's behind it, causing text to become unreadable in some scroll positions. Fix: add a semi-opaque text backing or increase panel opacity.
5. **Animating blur values.** Causes severe frame drops on all but the most powerful hardware. Fix: animate opacity on a pre-blurred element.
6. **No fallback.** Users on older browsers or with `prefers-reduced-transparency` get a broken layout. Fix: always provide solid-surface fallbacks via `@supports` and media queries.
7. **Multiple overlapping glass layers.** Two blurred elements stacking (e.g., a dropdown over a modal, both with blur) cause compounding GPU cost and visual muddiness. Fix: remove or reduce blur on the lower layer when the upper layer is active.

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

See **Section 3** for full glassmorphism specification.

---

## 5. Typography: The Editorial Voice

Hierarchy is established through the tension between a high-brow serif and a modernist sans.

- **Display & Headlines (Noto Serif):** These are the "headings of a manuscript." Use `display-lg` (3.5rem) with tight letter-spacing for high-impact editorial moments. The serif provides authority and history.
- **Title, Body, & Labels (Poppins):** These are the "annotations." Poppins provides the clarity required for digital utility. `body-md` (0.875rem) is our workhorse for legibility.
- **Styling Note:** Headlines should always utilize `on_surface` (#201A19) for maximum contrast, while secondary information uses `on_surface_variant` (#55423F) to create a "receding" effect.

---

## 6. Components: Tactile Primitives

### Buttons
- **Primary:** `primary_container` (#5D1E1B) fill with `on_primary_container` (#F7EEEC) text. This is the Sage-based variant.
- **Secondary:** `secondary_container` (#536256) fill with `on_secondary_container` (#F7EEEC) text. This is the Sage-based variant.
- **Tertiary:** No fill, Noto Serif typeface, `surface_tint` color. Use for low-emphasis navigation.

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Execution:** Separate list items using `spacing-2` (0.7rem) of vertical white space. If separation is needed, use a subtle background shift to `surface_container_low`.
- **Corner Radius:** All cards should default to `lg` (1rem) to maintain the "Soft" aesthetic.

### Input Fields
- **Style:** Instead of a boxed outline, use a "debossed" look. Fill with `surface_container` (#F7EBE8) and a 1px `outline_variant` at 20% opacity.
- **Focus:** Transition to a Sage Green (`secondary`) "Ghost Border" to signal an active, thoughtful state.

### Signature Component: The "Curator's Tray"
A wide, horizontal container with `surface_container_highest` background and `xl` (1.5rem) rounded corners. Use this to group related academic resources or metadata, utilizing the new Sage Green for category chips within the tray.

### Typography
**Typography** — Noto Serif for headings, Poppins for body/labels

---

## 7. Do's and Don'ts

### Do
- **Do** use `spacing-16` (5.5rem) between major sections to emphasize the premium, airy feel.
- **Do** mix the typography: use a `headline-sm` (Noto Serif) next to a `label-md` (Poppins) to create an "annotated" look.
- **Do** use Sage Green (`secondary`) for "Success" or "Complete" states to maintain the earthy, academic tone instead of a generic bright green.
- **Do** design the background first when creating glassmorphic compositions. The glass is only as good as what sits behind it.
- **Do** test glassmorphic elements at every scroll position and over every possible background context.
- **Do** provide solid fallbacks for `@supports not (backdrop-filter)`, `prefers-reduced-transparency`, and `prefers-contrast: more`.
- **Do** use a single, consistent light direction (top-left) for all glass edge highlights and ambient shadows.
- **Do** pair glass with tinted ambient shadows to reinforce spatial separation.

### Don't
- **Don't** use 100% opaque borders. It shatters the tactile, glass-like illusion.
- **Don't** use standard "drop shadows." If it looks like a shadow, it's too dark. It should look like "ambient occlusion."
- **Don't** crowd the layout. If in doubt, add more white space using the `20` (7rem) spacing token.
- **Don't** use pure white backgrounds except for the `surface_container_lowest` interior of a card. The world of this design system is warm and tinted.
- **Don't** apply glassmorphism to every surface. Reserve it for floating, overlay, and navigational elements only (Z-2 and above). Overuse flattens the depth hierarchy and introduces contrast/readability failures.
- **Don't** use low blur values (below 20px) over complex backgrounds — it creates a distracting, busy appearance that competes with content rather than framing it.
- **Don't** ship glassmorphic elements without verifying text contrast across all possible background states. A translucent surface that passes contrast on one background may fail on another.
- **Don't** animate `backdrop-filter` blur values. Animate opacity on a pre-blurred element instead.
- **Don't** stack multiple glass layers without reducing blur on the lower layer.
- **Don't** use glassmorphism on cards, form containers, sidebars, or page-level sections.
- **Don't** use cool-toned (blue, purple, neon) glass fills. Our glass is warm and earthy, tinted with `surface_variant` and `outline_variant` tokens.

---

## Sources & Further Reading
- [NN/g: Glassmorphism — Definition and Best Practices](https://www.nngroup.com/articles/glassmorphism/) — Megan Brown, June 2024
- [UX Pilot: 12 Glassmorphism UI Features, Best Practices, and Examples](https://uxpilot.ai/blogs/glassmorphism-ui) — Khanh Linh Le, November 2025
- Apple Human Interface Guidelines — Materials (visionOS, iOS 26)
- Microsoft Fluent Design System — Acrylic Material
