# Branch 3: Accessibility

> Priority: P1 — High priority
> Depends on: None (independent)
> Date: 2026-04-22

## Problem Statement

Several core interactive patterns on Modern Scholar are not accessible to keyboard-only or screen reader users. The featured scholarships marquee has no keyboard navigation. The expanded scholarship modal does not return focus to the triggering element on close. The mobile navigation drawer has no focus trap. The search input in the filter bar collapses to zero width, making it invisible to assistive technologies. These issues collectively mean that users relying on assistive technology cannot fully navigate or interact with the platform's key features.

## Solution

Make all visually interactive elements keyboard-accessible. Implement proper focus management for modals and drawers. Ensure all icon-only controls have state-aware accessible labels. Fix the search input collapse pattern. Add `prefers-reduced-motion` checks to all infinite animations.

## User Stories

1. As a keyboard user browsing the home page, I want to Tab through the featured scholarship marquee cards and activate them, so that I can navigate to the scholarships page from any card.
2. As a screen reader user who opens an expanded scholarship modal, I want focus to return to the card I clicked when I close the modal, so that I don't lose my place in the grid.
3. As a keyboard user who opens the mobile navigation drawer, I want Tab to cycle only within the drawer (focus trap), so that I don't accidentally interact with content behind the overlay.
4. As a screen reader user on the scholarships page, I want the search input to be discoverable even when visually collapsed, so that I can search for scholarships without relying on mouse interaction.
5. As a user with motion sensitivity, I want infinite animations (nudge arrow on contact page, marquee scroll) to respect `prefers-reduced-motion`, so that I don't experience discomfort.
6. As a screen reader user interacting with the scholarship grid layout toggle, I want to hear both the layout name and the current state ("Grid layout, pressed" vs "Grid layout, not pressed"), so that I understand the current view mode.
7. As a screen reader user on the blog listing page, I want the reading time bars to have an accessible text alternative, so that I can understand the estimated reading time without seeing the visual bars.

## Implementation Decisions

### Module 1: Marquee Card Keyboard Accessibility

In `src/components/home/featured-scholarships.tsx`, the `ScholarshipCard` component (currently a `<div>`) must become keyboard-accessible:

- Wrap each card in an `<a href="/scholarships">` tag (since clicking any marquee card conceptually navigates to the scholarships page).
- Add visible focus ring styles using the existing `focus-visible:ring-[3px] focus-visible:ring-ring/50` pattern from the Button component.
- Add `aria-hidden="true"` to the duplicated track set (the second set of cards exists purely for the infinite scroll illusion and should not be announced twice by screen readers).
- Add `role="list"` on the row container and `role="listitem"` on each card wrapper for semantic structure.

### Module 2: Modal Focus Management

In `src/components/scholarships/scholarship-grid.tsx`, the expanded scholarship modal needs proper focus lifecycle:

- Before opening: capture `document.activeElement` in a ref (`previousFocusRef`).
- On open: the existing `autoFocus` on the close button is sufficient for initial focus.
- On close (`handleClose`): call `previousFocusRef.current?.focus()` to return focus to the triggering card.
- Move `role="dialog"` from the backdrop overlay `<div>` to the inner `motion.div[data-modal-content]` — the dialog role should be on the content panel, not the full-screen backdrop.

### Module 3: Mobile Navigation Focus Trap

In `src/components/ui/header/mobile-menu.tsx`:

- When the mobile drawer opens, query all focusable elements within the drawer.
- Add a `keydown` event listener that intercepts Tab at the first and last focusable elements to create a cycle.
- On close, restore focus to the mobile menu button.
- Add `aria-controls` on the `MobileMenuButton` pointing to the drawer's `id`.

This can be implemented with a custom `useFocusTrap` hook or by leveraging Base UI's `FocusTrap` component if available.

### Module 4: Search Input Accessibility

In `src/components/scholarships/scholarship-filters.tsx`:

- Replace the `w-0` collapse pattern with `visibility: hidden` + `width: 0` when closed, and `visibility: visible` + appropriate width when open. This ensures the input is not programmatically discoverable when collapsed.
- Add `role="search"` and `aria-label="Search scholarships"` to the outer motion container.
- Ensure the expand button has `aria-expanded` reflecting the search open state.

### Module 5: Reduced Motion for Infinite Animations

In `src/components/contact/contact-form-section.tsx` (NudgeArrow component):

- Check `useReducedMotion()` from Motion.
- If reduced motion is preferred, render the arrow statically without the `y` and `rotate` keyframe arrays.

In `src/components/home/featured-scholarships.tsx` (MarqueeRow):

- The CSS `@keyframes marquee` animation should have a `@media (prefers-reduced-motion: reduce)` override that sets `animation: none`.
- Alternatively, check `useReducedMotion()` in the React component and skip the `animate` class.

### Module 6: State-Aware Icon Labels

Audit all icon-only buttons and ensure `aria-label` reflects current state:

- Layout toggles in `scholarship-filters.tsx`: Already use `aria-pressed` (correct). Verify `aria-label` is static ("Grid layout" / "Bento layout") — these are fine because `aria-pressed` communicates state.
- Save/share buttons in the expanded modal (`scholarship-grid.tsx` lines 622–636): Add `aria-label="Save scholarship"` and `aria-label="Share scholarship"`.

### Module 7: Reading Time Bars Accessible Alternative

In `src/components/blog/blog-card.tsx`, the `ReadingTimeBars` visual indicator:

- Add `role="img"` to the bars container.
- Add `aria-label={`${readTime} read`}` to provide the text equivalent.
- Remove the `title` attribute (which is unreliable for screen readers) in favor of the `aria-label`.

## Testing Decisions

- **Modules to test**: Module 1 (keyboard Tab sequence through marquee), Module 2 (focus return after modal close), Module 3 (focus trap cycle in mobile drawer)
- **Prior art**: The project uses Storybook with accessibility checking. Playwright tests can assert focus management via `page.evaluate(() => document.activeElement)`. The existing `sort-by-filter.test.ts` in the scholarships directory provides a pattern for component interaction tests.

## Out of Scope

- Full WCAG 2.2 AA audit (this branch addresses the critical findings only)
- Color contrast adjustments (the OKLCH palette was designed for contrast compliance)
- Screen reader testing across multiple AT combinations (NVDA, JAWS, VoiceOver)
- `lang` attribute for non-English scholarship content

## Further Notes

- The focus trap implementation in Module 3 should be reusable — the same pattern will be needed if any future modals or drawers are added.
- After implementing Module 2, verify that the `AnimatePresence` exit animation on the modal does not interfere with the focus return timing. The `onAnimationComplete` callback from Motion may be needed to delay the `focus()` call until after the exit animation.
- The marquee keyboard accessibility (Module 1) may require discussion about whether individual cards should be focusable (adding many tab stops) or whether a single "View all scholarships" link is sufficient. Recommend the link approach for simplicity, with `aria-hidden="true"` on the marquee track.
