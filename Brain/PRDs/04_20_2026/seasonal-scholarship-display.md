# Seasonal Scholarship Display

## Problem Statement

The scholarship listing page currently displays hardcoded placeholder data filtered by subject categories (Technology, STEM, Arts, etc.) that don't exist in the real dataset. Students visiting the site need to see real scholarships relevant to the current season — scholarships they can actually apply to right now — filtered by their education level. The current UI structure (cards, grid, pagination, comparison) is solid but needs to be rewired to the new data shape.

## Solution

Replace the placeholder data layer with real scholarship JSON (produced by the enrichment pipeline). Display only scholarships in the current season with deadlines that haven't passed. Replace subject category tabs with education level tabs. Keep the image overlay card design, comparison feature, and pagination. Comment out server-dependent features (rating, tags, profile matching) until a backend exists.

**MVP scope:** Scholarships are displayed for the current season only — users cannot change seasons. Post-MVP will add season and year selectors.

## User Stories

1. As a student, I want to see only scholarships for the current season when I land on the page, so that I immediately see what's relevant to apply for now.
2. As a student, I want past-deadline scholarships hidden even within the current season, so that I don't waste time on expired opportunities.
3. As a student, I want to filter scholarships by my education level (High School, Undergraduate, Graduate, K-8, K-12) via tabs, so that I only see scholarships I'm eligible for.
4. As a student, I want to see a helpful message when no scholarships match my education level this season, hinting that new ones may come next season, so that I'm not left at a dead end.
5. ~~As a student, I want to see a warning badge on scholarships with broken links, so that I know before clicking that the link may not work.~~ *Deferred — no link status data in current scraped output.*
6. As a student, I want to see each scholarship's award amount, deadline date, and a short description on the card, so that I can quickly assess fit without clicking.
7. As a student, I want to click a scholarship card to see full details (eligibility requirements, open date, direct link), so that I can decide whether to apply.
8. As a student, I want to compare scholarships side-by-side using the comparison feature, so that I can evaluate my top choices together.
9. As a student, I want scholarships without images to still look visually appealing (generated gradient), so that the browsing experience feels consistent.
10. As a student, I want paginated results (12 per page), so that the page loads quickly and I can browse systematically.
11. As a student, I want to search scholarships by name or keyword within the current season, so that I can find specific opportunities I've heard about.
12. As a student, I want to sort scholarships by deadline (soonest first) or award amount (highest first), so that I can prioritize my applications.
13. As a student, I want the "Apply Now" button in the expanded card to link to the actual scholarship URL, so that I can go directly to the application.
14. As a student, I want the filters to be accessible and usable on mobile, so that I can browse on my phone.
15. As a student, I want the hero section stats to reflect only what's available this season, so that the numbers are accurate and trustworthy.

## Implementation Decisions

### Data Layer Changes

**Data source:** `src/data/scholarships-enriched.json` — a flat JSON array produced by the scraping pipeline (`scripts/scrape-scholarships.ts`). The pipeline scrapes scholarship URLs via Firecrawl, downloads/compresses images, and merges CSV metadata with scraped content. Intermediate per-scholarship files are cached in `scripts/output/scraped/` but the app reads only the final enriched JSON.

**`src/data/scholarships.ts`** becomes a thin re-export:
- Imports from generated `scholarships-enriched.json`
- Strips the internal `_scraped` metadata object before exposing data (present in cached files, not in enriched JSON)
- Exports the new `Scholarship` type, `EDUCATION_LEVELS`, and `SEASONS` constants
- Comments out (does not delete): `rating`, `tag`, `ScholarshipTag`, `ScholarshipCategory`, `SCHOLARSHIP_CATEGORIES`

**Enriched scholarship data shape** (each element in the JSON array):
```ts
interface EnrichedScholarship {
  id: string                  // slug, e.g. "engebretson-foundation-scholarship-march-1"
  name: string                // display name (note: "name", not "title")
  deadline: string            // "March 1", "January 21"
  deadlineYear: number        // 2027
  awardAmount: string         // "$10,000" or "105 scholarships at $25,000 each"
  classification: string[]    // ["High School", "Undergraduate"] — education levels
  link: string                // URL to application
  openDate: string | null     // application open date (currently always null)
  eligibility: string         // multi-line eligibility text
  season: Season              // pre-computed: "winter" | "spring" | "summer" | "fall"
  image: string               // relative webp path (e.g. "/scholarships/slug.webp") or literal "gradient"
  description: string         // generated ~500 char summary (may be empty string)
  provider: string            // from og:siteName or derived from domain
}
```

**New constants and types:**
```ts
export type EducationLevel = "High School" | "Undergraduate" | "Graduate" | "K-8" | "K-12"
export type Season = "winter" | "spring" | "summer" | "fall"

export const EDUCATION_LEVELS = ["All", "High School", "Undergraduate", "Graduate", "K-8", "K-12"] as const
export const SEASONS = ["winter", "spring", "summer", "fall"] as const
```

**Note on `awardAmount`:** This field is a free-text string, not a number. Values range from simple (`"$1,000"`) to complex (`"105 scholarships at $25,000 each"`). Sorting by award amount requires parsing the first dollar value from the string. Cards should display the raw string as-is.

### Season Logic

**Current season is auto-detected** — no user selection in MVP.

Season is determined from the pre-computed `season` field on each scholarship (set by the enrichment pipeline). The current season is derived server-side from `new Date().getMonth()`:

| Season | Months |
|--------|--------|
| Winter | December, January, February |
| Spring | March, April, May |
| Summer | June, August |
| Fall | September, October, November |

**Display rule:** A scholarship is shown if:
1. `scholarship.season === currentSeason`
2. Full deadline date (`deadline` + `deadlineYear`) >= today

Page must use **dynamic rendering** (no static cache) so that season and deadline checks are always fresh.

**Empty season:** If no scholarships exist for the current season, show empty state: *"No scholarships available this [season]. New scholarships are coming in [next season]!"*

### Filter Architecture

Single-tier filtering (no season tabs in MVP):

1. **Education Level tabs** (primary) — 6 tabs: All, High School, Undergraduate, Graduate, K-8, K-12. Each tab shows a count badge of in-season scholarships matching that level. Scholarships with multi-level `classification` arrays (e.g., `["High School", "Undergraduate"]`) appear under both tabs. Tabs with zero matches show count 0 — clicking them triggers empty state: *"No [education level] scholarships this [season]. New scholarships are added each season — check back in [next season]!"*
2. **Search** — filters by name/eligibility text within the active education level + current season. Empty search results show standard "No scholarships found" message.
3. **Sort** — deadline (default, soonest first) or award amount (highest first). Rating sort removed.

### Hero Section

Server component with **dynamic rendering**. All stats scoped to current season's eligible scholarships (in-season + deadline not passed):

- Total scholarship count for current season
- Number of education levels represented
- Highest award amount this season
- Deadlines this month

### Card Component Changes

**Keep:**
- Image overlay design with gradient
- Comparison toggle button (comparison naturally scoped to current season since out-of-season cards aren't rendered)
- Expand-to-modal interaction
- Award amount + deadline display

**Add:**
- Education level badges (small pills showing "High School", "Undergraduate", etc.) — from `classification` array
- Provider name display — from `provider` field
- Gradient background fallback when `image === "gradient"` (CSS linear-gradient derived from ID hash)
- Eligibility text in expanded modal
- Open date in expanded modal (when available — currently always null, but field exists for future use)
- Direct link to scholarship URL ("Apply Now" -> `target="_blank"`) — from `link` field

**Remove/Comment Out:**
- Rating stars (no data)
- Tag badges — Featured, Popular, etc. (no data)
- MatchBadge component usage (profile-dependent)
- Old hardcoded provider text (replaced by `provider` field from scraped data)

### Gradient Fallback Logic

When `scholarship.image === "gradient"`:
- Hash the scholarship ID to a number
- Derive two OKLCH hues from that hash (offset by ~60 degrees)
- Render as `linear-gradient(135deg, oklch(0.7 0.15 ${hue1}), oklch(0.5 0.12 ${hue2}))`
- Applied as inline style on the card's image area

### Pagination

- 12 cards per page (reduced from current 15 to account for larger real-data cards)
- Existing pagination component (`PaginationInkSpread`) reused
- Operates on the seasonally-filtered set
- Resets to page 1 on education level or search change

### Expanded Modal Changes

- Show full eligibility text (scrollable)
- Show open date if available
- Show education level classification
- "Apply Now" links to `scholarship.link` with `target="_blank" rel="noopener"`
- Remove rating display
- Remove tag display

### Modules Affected

1. **`src/data/scholarships.ts`** — Complete rewrite of types and exports
2. **`src/components/scholarships/scholarship-filters.tsx`** — Replace category pills with education level tabs
3. **`src/components/scholarships/scholarship-grid.tsx`** — New filtering logic: current season + past-deadline removal + education level matching
4. **`src/components/scholarships/scholarship-card.tsx`** — Adapt to new data shape, add gradient fallback, link badge, education level pills
5. **`src/components/scholarships/scholarship-filters-mobile.tsx`** — Match desktop filter changes
6. **`src/components/scholarships/scholarship-hero.tsx`** — Stats scoped to current season, dynamic rendering
7. **`src/app/scholarships/page.tsx`** — Ensure dynamic rendering (no static cache)
8. **`src/stores/comparison.ts`** — Verify works with new ID format (should be fine, uses string IDs)
9. **`src/components/scholarships/category-section-nav.tsx`** — Remove or repurpose (no longer category-based)

### Modules to Comment Out (not delete)

- `src/stores/profile.ts` — profile matching logic
- `src/components/ui/profile-setup.tsx` — profile setup trigger
- `src/components/scholarships/match-badge.tsx` — match score badge
- References to `ProfileSetupTrigger` in filters
- References to `computeMatchScore` in card
- Season tab UI code (defer to post-MVP)

## Testing Decisions

- **Modules to test**: `getCurrentSeason()` helper (month -> season), `isScholarshipVisible(scholarship, today)` (season match + deadline not passed), education level filter logic (array inclusion matching), gradient hash function (deterministic output). These are pure functions.
- **Prior art**: No existing component tests. Vitest for unit tests on filter/sort utilities.
- **Manual verification**: Load page -> verify current season auto-selected -> filter by education level -> verify empty states -> expand card -> click apply link -> confirm comparison still works.

## Post-MVP

- **Season & year selector** — allow users to browse scholarships across seasons and years. Architecture supports this: just expose a season selector UI and remove the auto-season lock.
- Subject/category-based filtering (needs backend tagging logic)
- Profile matching / MatchBadge
- Bookmark/save functionality (needs backend)

## Out of Scope

- Subject/category-based filtering (no data)
- Rating display or sorting
- Tag badges (Featured, Popular, etc.)
- Profile matching / MatchBadge
- Bookmark/save functionality (no backend)
- Share functionality (could be added later as URL copy)
- Season or year selection (post-MVP)

## Further Notes

- **Performance**: With ~50 cards per season and image overlay design, lazy loading images (`loading="lazy"` or Next.js Image component) is essential. The current setup already uses `next/image` which handles this.
- **Accessibility**: Education level tabs should use `role="tablist"` / `role="tab"` / `role="tabpanel"` pattern. Empty state messages should be announced to screen readers.
- **URL state**: Education level selection should be URL-persisted (`?level=undergraduate`) via nuqs so students can share filtered views. No season URL param in MVP.
- **Migration path**: Old placeholder data can be kept on a branch for reference but should be fully replaced in the main data file.
- **Dependency**: This PRD depends on `scripts/scrape-scholarships.ts` producing `src/data/scholarships-enriched.json` with the `season`, `deadlineYear`, `classification`, `provider`, and `image` fields. Run `npm run scrape-scholarships` (defaults to current season) or `npm run scrape-scholarships -- --all` for all seasons.
