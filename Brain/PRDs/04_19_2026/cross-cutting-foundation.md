# Module 1: Cross-Cutting Foundation

> Part of the [UX/UI Audit](ux-audit-overview.md) — Priority: P0

## Problem Statement

The shared UI infrastructure has critical accessibility gaps, duplicated code, and missing polish that compounds across every page. Animation components ignore `prefers-reduced-motion`, the ripple effect is copy-pasted across three button files (already diverging), there are no page transitions between routes, the mobile menu doesn't close on navigation, the header has sizing and measurement bugs, and dark mode neumorphic shadows are flat. These issues undermine the premium editorial aesthetic on every single page.

## Solution

Fix the shared foundation so every page benefits. This module touches no page-specific code — only components in `src/components/ui/`, `src/app/layout.tsx`, and `src/app/globals.css`.

## User Stories

1. As a user with vestibular sensitivity, I want animations to respect my `prefers-reduced-motion` OS setting, so that the site doesn't trigger discomfort.
2. As a mobile user, I want the navigation menu to close when I tap a link, so that I don't have to manually dismiss it after every navigation.
3. As a user navigating between pages, I want a smooth cross-fade transition, so that the site feels like a cohesive experience rather than hard page swaps.
4. As a mobile user, I want to see the brand logo in the header, so that I know what site I'm on.
5. As a dark mode user, I want buttons to retain their dimensional neumorphic style, so that the dark theme feels as polished as light.
6. As a keyboard user, I want visible focus indicators on all header interactive elements (logo link, theme toggle, settings), so that I can navigate without a mouse.
7. As a user hovering over a button, I want the custom cursor to change shape (not disappear), so that I know the element is interactive.
8. As a developer, I want the ripple effect extracted into a shared hook, so that button components stay consistent and maintainable.

## Implementation Decisions

### 1. Reduced Motion Guards

Add `useReducedMotion()` from `motion/react` to `AnimatedSection` and `AnimatedLines`. When reduced motion is preferred, skip entrance animations (render in final state immediately). Apply the same guard to `ParallaxLayer` — parallax is specifically flagged in WCAG SC 2.3.3 as a vestibular trigger.

**Components affected**: `animated-section.tsx`, `animated-lines.tsx`, `parallax-layer.tsx`

### 2. Extract `useRipple` Hook

Extract the ripple state machine (RippleState interface, createRipple, removeRipple, handleMouseMove, snapRipple, AnimatePresence render block) into a shared `useRipple(ref)` hook that returns `{ripple, rippleHandlers, RippleOverlay}`. All three button components (`button.tsx`, `button-link.tsx`, `cta-button.tsx`) consume the hook. Standardize timing to `duration: 0.4, ease: "circOut"` across all variants.

**New file**: `src/hooks/use-ripple.ts`
**Components affected**: `button.tsx`, `button-link.tsx`, `cta-button.tsx`

### 3. Page Transitions

Add a layout-level `AnimatePresence` wrapper with a simple cross-fade + slide-up transition (250ms, `[0.22, 1, 0.36, 1]` easing). This wraps the `{children}` inside the root layout's `PageShell`. Use `usePathname()` as the `key` for `AnimatePresence`.

**Components affected**: `layout.tsx` or a new `page-transition.tsx` wrapper

### 4. Mobile Menu Close on Navigate

In `MobileMenuButton`, add a `useEffect` that watches `usePathname()` and calls `setIsOpen(false)` on change.

**Components affected**: `mobile-menu.tsx`

### 5. Header Fixes

- **Logo sizing**: Match `width`/`height` props to rendered size, or use correct Tailwind class. Same fix needed in footer.
- **Active indicator font guard**: Wrap `measureActive()` in `document.fonts.ready.then(...)`. Add `ResizeObserver` for viewport changes.
- **Mobile logo**: Show a small logo (`size-8`) in the mobile header next to the hamburger button.
- **Active link typography**: Add `text-primary font-medium` on the active nav link in addition to the spring indicator.
- **Mobile menu social links**: Replace `href="#"` placeholders with real URLs from a shared constants file, or remove until real destinations exist.

**Components affected**: `header.tsx`, `mobile-menu.tsx`, `footer.tsx`

### 6. Dark Mode Neumorphic Shadows

Increase the light highlight in dark mode from `rgba(255,255,255,0.05)` to `rgba(255,255,255,0.12-0.15)`. Differentiate per variant (primary gets warm highlight, secondary gets cooler green-tinted one).

**Components affected**: `globals.css` (lines 351-354)

### 7. Custom Cursor `fade` Variant

Replace `opacity: 0` with a subtle morph — slightly larger circle or pulse ring on interactive elements. The cursor should always indicate position.

**Components affected**: `custom-cursor.tsx`

### 8. Button System Cleanup

- `CTAButton`: Add `focus-visible:ring` and `disabled:opacity-50` classes. Consider implementing as a Base UI Button primitive wrapper.
- `outline` variant: Change hover text from `text-white` to `text-primary` (white on `primary-100` ripple is ~1.2:1 contrast — WCAG fail).
- `ghost` variant: Add subtle background on light mode hover.

**Components affected**: `button.tsx`, `cta-button.tsx`

### 9. Footer Fixes

- Replace `h-[50vh]` with `min-h-[50vh] h-auto` to prevent overflow on short viewports.
- Change column labels from `font-heading` (Noto Serif) to `font-sans` (Poppins) per design system convention for UI labels.
- Add `aria-hidden="true"` to decorative `<Icon>` components inside aria-labelled social links.
- Add `aria-hidden="true"` to the mobile menu `Curve` SVG.

**Components affected**: `footer.tsx`, `mobile-menu.tsx`

### 10. Mobile Menu Animation Speed

Reduce `menuSlide` duration from 0.8s to 0.45s enter / 0.35s exit. Reduce `linkSlide` stagger from 0.05 to 0.04. Reduce SVG Curve animation from 1s to 0.5s.

**Components affected**: `mobile-menu.tsx`

## Testing Decisions

- **Modules to test**: `useRipple` hook (unit tests for state transitions), `AnimatedSection` and `AnimatedLines` reduced-motion behavior (Playwright with `prefers-reduced-motion: reduce` emulation), page transitions (Playwright navigation test)
- **Prior art**: Vitest for unit tests, Playwright for browser tests per project setup

## Out of Scope

- Page-specific component changes (handled in Modules 2-5)
- New component creation (handled in Module 6)
- Color system overhaul (current OKLCH palette is well-designed)
- Custom cursor removal (it adds brand character; just fix the fade variant)

## Further Notes

- The `AnimatedLines` chars mode has a word-wrapping issue where `inline-block` spans can break mid-word on narrow viewports. Fix: split by word first, then by character within each word, wrapping each word in a `whitespace-nowrap` span.
- The `AnimatedSection` with `once: true` can cause a flash of invisible content on slow connections when hydration completes after scroll. Consider CSS-based approach for above-the-fold hero sections.
- Standardize entrance animation easing to `[0.22, 1, 0.36, 1]` (approximates `easeOutExpo`) across both `AnimatedSection` and `AnimatedLines` for visual coherence.
