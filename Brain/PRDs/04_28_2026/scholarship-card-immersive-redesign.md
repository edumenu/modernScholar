## Problem Statement

Scholarship cards currently rely on background images that add visual noise, slow page loads, and create an inconsistent experience — some cards have curated photography while others fall back to a generic gradient. Removing images and redesigning the card around typography, classification-driven color tinting, and structured metadata will create a cohesive, editorial aesthetic that scales uniformly across all scholarships and reduces asset management overhead.

## Solution

Replace both scholarship card components (grid card and coverflow card) with a new "Immersive Tonal" design language. Each card's background color is driven by its primary education-level classification (e.g., Undergraduate = sage green tint, Graduate = terracotta tint), creating automatic visual grouping. The title is the dominant element with a gradient-fade underline that extends on hover. The award amount is treated as a display-size figure — the second-largest typographic element. Solar Linear icons anchor the amount and deadline metadata. No images are used anywhere in the card system.

## User Stories

1. As a student browsing the scholarship grid, I want each card's background color to reflect its education level, so that I can visually scan and group scholarships by relevance without reading every label.
2. As a student, I want the scholarship title to be the most prominent element on the card with a decorative underline, so that I immediately know which scholarship I'm looking at.
3. As a student, I want the award amount displayed prominently with an icon, so that I can quickly assess the financial value without hunting for it in small text.
4. As a student, I want the deadline displayed with a calendar icon, so that I can assess urgency at a glance.
5. As a student, I want to see the provider name on every card, so that I know who is offering the scholarship without clicking into details.
6. As a student viewing the grid, I want to see a 1-2 line description, so that I get enough context to decide whether to click.
7. As a student viewing the coverflow carousel on the home page, I want cards to feel tall and spacious with generous whitespace, so that the featured section feels premium and curated.
8. As a student, I want the coverflow card to omit the description and CTA button, so that the tall format stays clean and uncluttered at non-center positions.
9. As a student hovering over a grid card, I want the card to lift slightly, the shadow to deepen, and the underline to extend, so that I get clear interactive feedback.
10. As a student hovering over a coverflow card, I want the card to scale up subtly, so that the active card feels responsive.
11. As a student, I want a compare toggle button on grid cards, so that I can add scholarships to my comparison list.
12. As a student, I want a "View Details" label and ghost icon button at the bottom of grid cards, so that I have a clear affordance to learn more.
13. As a student viewing dimmed (non-matching filter) cards, I want them to appear at reduced opacity and desaturated, so that I understand they don't match my current filter but are still visible for context.
14. As a student clicking a grid card, I want an expanded overlay/modal to appear with full scholarship details styled consistently with the new card design, so that the transition feels cohesive.
15. As a student, I want the expanded overlay to use the same classification-driven tint and typography as the card, so that the visual identity carries through from card to detail.
16. As a developer, I want the `image` field removed from the `Scholarship` type and all image-related code paths cleaned up, so that dead code doesn't accumulate.
17. As a developer, I want the card Storybook stories updated to reflect the new design, so that the component library stays current and useful for design reviews.

## Implementation Decisions

### Module 1: Grid Scholarship Card (replace `scholarship-card.tsx`)

Replace the current `ScholarshipCard` component with the Immersive Tonal design already prototyped in `scholarship-card-immersive.tsx`. The new component must re-integrate the following props that the grid system depends on:

- `isExpanded` — controls visibility when the expand overlay is active (animate opacity to 0, add `invisible` class)
- `disableLayoutAnimation` — conditionally applies `layoutId` for shared-element transitions with the expand overlay
- `layoutId` — `card-{scholarship.id}` for Motion layout animations between card and modal

**Card anatomy (top to bottom):**
- Classification pills (top-left) + Compare toggle button (top-right)
- Title (Noto Serif, xl, bold) + gradient-fade underline (starts w-2/3, extends to w-full on group-hover)
- Provider name (xs, muted)
- Award amount with `solar:money-bag-linear` icon (Noto Serif, 2xl, bold — display figure)
- Deadline with `solar:calendar-linear` icon (xs, muted)
- Description (xs, 2-line clamp)
- Spacer (flex-1)
- CTA row: "View Details" label (left) + ghost icon button with `solar:arrow-right-linear` (right)

**Classification-driven tint mapping:**
- High School → `bg-primary-100`, accent `from-primary/30`, text `text-primary-800`
- Undergraduate → `bg-secondary-100`, accent `from-secondary/30`, text `text-secondary-800`
- Graduate → `bg-tertiary-100`, accent `from-tertiary/30`, text `text-tertiary-800`
- K-8 → `bg-primary-50`, accent `from-primary/20`, text `text-primary-700`
- K-12 → `bg-secondary-50`, accent `from-secondary/20`, text `text-secondary-700`

**Container:** No border, shadow-only edges (`0 6px 32px rgba(32,26,25,0.07)`, upgrades to `0 12px 48px rgba(32,26,25,0.12)` on hover). Rounded-2xl.

**Hover:** Spring animation `scale: 1.015, y: -3`. Shadow upgrade. Underline extends.

### Module 2: Coverflow Card (rewrite inner card in `coverflow-carousel.tsx`)

Rewrite the `CoverflowCard` component inside `coverflow-carousel.tsx` using the same Immersive Tonal design language, adapted for the tall coverflow format.

**Coverflow card anatomy (top to bottom):**
- Classification pills (top)
- Generous whitespace
- Title (Noto Serif, xl, bold) + gradient-fade underline
- Provider name
- Award amount with icon (display figure)
- Deadline with icon

**Omitted from coverflow:** Description, CTA button, compare toggle. The coverflow card is a `<button>` element — clicking navigates or focuses.

The outer `CoverflowCarousel` component (3D transforms, autoplay, drag, keyboard nav, arrows) remains unchanged. Only the inner `CoverflowCard` presentation changes.

### Module 3: Expanded Overlay (update in `scholarship-grid.tsx`)

Update the expanded card modal to remove the image section and use the Immersive Tonal design language:

- Replace the image/gradient hero with a classification-tinted header zone using the same tint mapping as the card
- Title uses the same Noto Serif bold treatment
- Provider, amount (with icon), deadline (with icon) follow the card's visual hierarchy
- Eligibility section, description, and CTA row ("Apply Now" + share button) remain in a clean surface body zone below
- Close button adapts to work on the tinted background instead of a dark image overlay

### Module 4: Data Model Cleanup

Remove the `image` field from the `Scholarship` TypeScript interface in `scholarships.ts`. Clean up all related code:

- Remove `image` from the `Scholarship` type definition
- Remove `generateGradient` function and `GRADIENT_CLASSES` constant
- Remove all `isGradient` / `isGradientImage` conditional branches in card components, coverflow, and grid overlay
- Remove the `next/image` import from card and coverflow components
- Update `scholarships-enriched.json` to strip the `image` field from all entries (or leave it as inert data — implementation choice)

### Module 5: Storybook Update

Update `scholarship-card.stories.tsx` to use the new `ScholarshipCard` component. Stories should cover:

- Default state (one card per classification level: High School, Undergraduate, Graduate, K-8, K-12)
- Multiple classifications on one card
- Dimmed state (filtered out)
- Long title edge case (20+ words, verify line-clamp)
- No description edge case
- Compared state (compare toggle active)

Remove mock data referencing image paths. Set `image: "gradient"` or remove entirely depending on Module 4 timing.

## Testing Decisions

### Modules to test

**Module 1 — Grid ScholarshipCard:**
- Renders all required elements (title, provider, amount, deadline, description, pills, CTA)
- Classification-driven tint applies correct background class per education level
- Dimmed state reduces opacity and disables pointer events
- Compare toggle calls `useComparisonStore.toggle` with correct scholarship ID
- Click handler calls `onExpand` with scholarship ID
- Gradient-fade underline renders with correct initial width class
- Long title is clamped to 2 lines
- Missing description does not render description element

**Module 4 — Data Model:**
- `Scholarship` type no longer includes `image` field (compile-time check)
- All scholarship entries in enriched data parse correctly without `image`
- `CLASSIFICATION_COLORS` mapping returns correct values for all education levels
- `parseAwardAmount` still works correctly (regression)
- `isScholarshipVisible` still works correctly (regression)

### Prior art
- Existing tests in `src/components/scholarships/__tests__/` for current card behavior
- Storybook stories serve as visual regression baseline

## Out of Scope

- Dark mode adaptation for tint colors — follow up after base implementation lands
- Animated transitions between old and new card design — this is a full replacement, not a progressive rollout
- Card interaction patterns beyond what exists today (e.g., swipe-to-dismiss, long-press)
- Changes to the scholarship data pipeline or scraping logic
- Changes to the filter bar, pagination, or comparison sheet components
- Performance optimization of the coverflow 3D transforms (separate concern)

## Further Notes

- The Immersive Tonal prototype already exists at `scholarship-card-immersive.tsx` and can serve as the starting point for Module 1. It needs `isExpanded`, `disableLayoutAnimation`, and `layoutId` props added back.
- Module 3 (expanded overlay) should be implemented after Module 1 so the `layoutId` shared-element transition works correctly between the new card and the new overlay.
- Module 4 (data model cleanup) can be done in parallel with Modules 1-2 on a separate branch, or sequentially after — either approach works since the current code already handles the `image === "gradient"` case everywhere.
- The classification tint system creates an implicit legend: users will learn that green = Undergraduate, red-brown = High School, terracotta = Graduate. Consider adding an explicit color legend to the filter bar in a future iteration.
