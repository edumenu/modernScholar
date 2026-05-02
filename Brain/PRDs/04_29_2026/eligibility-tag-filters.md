# Eligibility & Award Filters for Scholarship Discovery

## Problem Statement

The scholarship data contains 160+ unique free-text eligibility strings and varied award amounts. Users cannot filter scholarships by eligibility criteria (race/ethnicity, gender, financial need, disability, major, etc.) or by award amount range. They must read each card's eligibility text individually and manually scan award amounts to find scholarships that match their profile and financial needs. The initial dropdown implementation was too cramped for the number of filter options.

## Solution

Replace the eligibility filter dropdown with a full right-side filter sheet (matching the comparison sheet pattern). The sheet contains animated checkboxes for eligibility tags and a dual-range award amount slider with animated number displays. Filters apply in real-time as users interact. A sticky footer shows a live scholarship count and a "Clear all" action.

The trigger button is renamed from "Eligibility" to "Filters" and remains in its current position (right of the Sort button). Active filter selections display as dismissible chips in a strip between the filter bar and results grid.

## User Stories

1. As a student, I want to open a filter sheet by clicking "Filters" so that I have a spacious, organized view of all available filter options.
2. As a student, I want to filter scholarships by eligibility criteria (e.g., "Need-Based", "First-Generation") so that I only see scholarships I likely qualify for.
3. As a student from a specific demographic, I want to select my race/ethnicity, gender, or disability status via animated checkboxes so that I discover scholarships targeted to my identity.
4. As a student in a specific major, I want to filter by my field of study (e.g., "STEM/Engineering", "Healthcare/Nursing") so that I find major-specific scholarships.
5. As a student with a minimum award threshold, I want to set an award amount range using a dual slider so that I only see scholarships within my desired funding level.
6. As a student, I want to see the award range displayed with animated number transitions as I drag the slider so that the interaction feels polished and responsive.
7. As a student with multiple qualifying criteria, I want to select tags across categories (e.g., "Race/Ethnicity: African American/Black" + "Need-Based") and see only scholarships matching ALL selected criteria.
8. As a student selecting multiple options within a category, I want OR logic (e.g., selecting both "Hispanic/Latino" and "African American/Black" shows scholarships matching either).
9. As a user, I want filters to apply in real-time as I toggle checkboxes and move sliders so that I see immediate feedback without clicking an "Apply" button.
10. As a user, I want a sticky footer in the filter sheet showing "Showing X scholarships" so that I always know the impact of my selections.
11. As a user, I want to see an active filter strip showing my current selections with individual dismiss buttons so I can quickly adjust filters without reopening the sheet.
12. As a user, I want award range to display as a chip (e.g., "$5,000 – $25,000") in the active filter strip, dismissible to reset the range.
13. As a user, I want a "Clear all" action in both the sheet footer and the active filter strip that resets all eligibility and award filters without affecting education level, search, or sort.
14. As a mobile user, I want filters integrated into the existing bottom sheet with the same checkboxes and slider so the interaction feels native to mobile.
15. As a user, I want eligibility and award filters to compose with existing education level tabs, search, and sort — narrowing results progressively.
16. As a user with no matching scholarships, I want a clear empty state message suggesting I adjust my filters.
17. As a user, I want the "Filters" button to show a count badge when any filters are active so I know at a glance.
18. As a user, I want scholarships with "Varies" award amounts to be included when the slider is at full range, but excluded when I narrow the range (since the actual amount is unknown).

## Implementation Decisions

### Data Model (Unchanged)

The `eligibilityTags` field (`string[]`, optional) on each scholarship in `scholarships-enriched.json` remains as-is from the initial implementation. Tags use a colon-delimited format:

- Flat tags (no sub-options): `"Need-Based"`, `"Merit-Based"`
- Category sub-options: `"Race/Ethnicity:African American/Black"`, `"Major-Specific:STEM/Engineering"`

### Tag Taxonomy (Unchanged)

**Flat Tags (6):** Need-Based, Merit-Based, First-Generation, State-Specific, Athletic, Creative/Arts

**Category Tags with Sub-Options (5):**

| Category | Sub-Options |
|----------|-------------|
| Gender-Specific | Women, Men |
| Race/Ethnicity | African American/Black, Hispanic/Latino, Jewish, HBCU |
| Disability/Health | Vision, Hearing, Learning Disability, Cancer/Chronic Illness, Mental Health |
| Major-Specific | STEM/Engineering, Business/Accounting, Healthcare/Nursing, Arts/Theater, Agriculture, Law, Architecture |
| Military/Veterans | Active Duty, Veteran, Military Dependent |

### UI Architecture — Filter Sheet (Replaces Dropdown)

**Trigger Button:**
- Label: "Filters" (renamed from "Eligibility")
- Position: right of Sort button in Row 2 (unchanged)
- Shows count badge when any filters active
- Opens a right-side Sheet (not a dropdown)

**Sheet Layout (top to bottom):**

1. **SheetHeader** — "Filters" title with close button
2. **Award Amount section** — Dual-range slider ($0–$100,000, $500 steps) with animated number display showing min/max values formatted as currency. Shows "Any amount" when at full default range.
3. **Separator**
4. **Eligibility section** — Section label, followed by flat tags as animated checkbox rows with scholarship counts
5. **Category accordions** — Expandable sections (one at a time) with animated checkbox sub-options and counts
6. **SheetFooter (sticky)** — Live count ("Showing X scholarships") + "Clear all" text button

**Active Filter Strip (between filter bar and results):**
- Eligibility chips: `[STEM/Engineering ×] [Need-Based ×]`
- Award range chip: `[$5,000 – $25,000 ×]` or `[Min $5,000 ×]` or `[Max $25,000 ×]`
- "Clear all" link at end
- Chips animate out on removal

**Mobile:**
- Eligibility section and award slider added inside existing bottom sheet
- Same animated checkboxes and slider components
- Award slider section placed before eligibility, after education level

### Checkbox Component — Base UI + Motion

- Uses `@base-ui/react/checkbox` as the accessible primitive (keyboard, aria-checked, focus management)
- Motion-animated checkmark SVG path overlay (spring animation on check/uncheck)
- Exposes `checked`, `onCheckedChange`, `children` (label), `disabled` props

### Slider Component — Radix + Base UI Tooltip

- Uses `@radix-ui/react-slider` for the dual-range slider primitive
- Tooltip references swapped to existing Base UI tooltip (not Radix tooltip)
- Styled to match design system: primary color for range fill, warm surface track
- Animated number display for min/max values using Motion number animation

### Award Range Slider Configuration

- **Range:** $0 – $100,000
- **Step:** $500
- **Default:** Full range (null — no filtering)
- **"Varies" handling:** Scholarships where `parseAwardAmount()` returns 0 are included at full range, excluded when range is narrowed from default
- **Display format:** Currency with commas ($5,000)

### Filter Composition Logic

- **Within an eligibility category:** OR (selecting "Black" + "Hispanic" shows scholarships matching either)
- **Across eligibility categories/flat tags:** AND (must match all selected groups)
- **Award range:** AND with eligibility (must match both eligibility criteria AND fall within award range)
- **With existing filters:** Filters apply as hard filter (non-matching hidden, not dimmed) after search text matching, before sorting. Education level tabs continue their existing dim behavior independently.
- **Real-time:** Filters apply immediately on interaction, no "Apply" button

### State Management

- Eligibility filter state: `string[]` of active tags, session-only (not URL-persisted)
- Award range state: `[number, number] | null`, session-only. `null` = full range (no filtering)
- Both managed in `ScholarshipGrid` component state
- Passed down to filter UI components as props

### New Dependencies

- `@radix-ui/react-slider` — dual-range slider primitive. Radix and Base UI (same team lineage) coexist without conflict.

### Filter Logic Extension

Extend `filterAndSort()` with an `awardRange: [number, number] | null` parameter:
- When `null`: no award filtering
- When `[min, max]`: include scholarship if `parseAwardAmount()` >= min AND <= max
- When range narrowed and `parseAwardAmount()` returns 0 ("Varies"): exclude

## Testing Decisions

### Modules to Test

1. **`filterAndSort()` with award range** — Unit tests for: null range (no filtering), narrowed range, "Varies" exclusion, combined with eligibility tags, combined with search + education level.
2. **Animated Checkbox component** — Storybook stories for: unchecked, checked, disabled, with label, animated transition.
3. **Slider component** — Storybook stories for: default full range, narrowed range, single-thumb moved, formatted currency display.
4. **Filter Sheet** — Storybook stories for: default state, with selections, expanded category, award range narrowed.

### Prior Art

- Comparison sheet in codebase as reference for right-side sheet pattern
- Existing `filterAndSort()` tests in `src/components/scholarships/__tests__/sort-by-filter.test.ts`
- Sort dropdown styling in `scholarship-filters.tsx` as reference for trigger button
- Motion animation patterns used throughout codebase

## Out of Scope

- URL persistence for filter state (deferred — can add via Nuqs later)
- Sub-filtering within State-Specific (e.g., individual states) — use search
- Backend/API integration — remains client-side static data
- AI-powered eligibility matching or scoring
- User profile-based auto-filtering (deferred to future profile page)
- Eligibility tag editing UI or admin interface
- Changes to scholarship card design to surface eligibility tags visually
- Tooltip on slider thumbs (may add later as enhancement)

## Further Notes

- The existing `eligibilityTags` data in `scholarships-enriched.json` from the tagging script is retained as-is. No data migration needed.
- The old `eligibility-filter-dropdown.tsx` component is replaced entirely by the new `filter-sheet.tsx`. The `EligibilityActiveFilters` component is updated to include award range chip display.
- The Radix slider code provided by the user should be adapted: tooltip imports swapped to Base UI, styling aligned with the OKLCH design system tokens.
- Consider adding tag counts to checkbox labels (e.g., "Need-Based (12)") to help users gauge result density before selecting.
- The animated number display on the slider values should use Motion's number animation for smooth transitions as the user drags thumbs.
