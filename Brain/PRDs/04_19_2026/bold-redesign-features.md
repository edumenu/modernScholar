# Module 6: Bold Redesign Features

> Part of the [UX/UI Audit](ux-audit-overview.md) — Priority: P2

## Problem Statement

Modern Scholar's foundation is well-built, but it doesn't yet differentiate from other scholarship platforms in ways that are immediately memorable. The audit identified 14 bold redesign ideas across all pages that would elevate the experience from "well-designed" to "best-in-class." These are aspirational features that should only be pursued after Modules 1-5 establish a solid, accessible, design-system-compliant baseline.

## Solution

Implement a curated set of high-impact design features that create signature moments across the site — features that users remember and talk about.

## User Stories

1. As a user navigating between pages, I want a smooth animated transition, so that the site feels like one cohesive experience. *(Handled in Module 1 — listed here as a dependency)*
2. As a student comparing scholarships, I want to select 2-3 cards and see them side-by-side, so that I can make informed decisions without switching tabs.
3. As a student scanning scholarship cards, I want to see a visual deadline urgency indicator, so that I can instantly prioritize time-sensitive opportunities.
4. As a blog reader, I want the first post on the listing to be a large, editorial-style featured card, so that the blog feels like a premium publication.
5. As a blog reader finishing an article, I want a small celebration animation, so that I feel rewarded for completing the read.
6. As a blog reader, I want pull quotes to break out of the prose column as large typographic moments, so that long articles have visual landmarks.
7. As a user on the contact page, I want an editorial "open letter" layout, so that the page feels personal and intentional rather than utilitarian.
8. As a desktop user hovering a scholarship card, I want it to flip to reveal eligibility details, so that I can quickly assess fit without opening a modal.
9. As a student, I want to see a personalized "Match %" on scholarships based on my profile, so that I know which ones are most relevant to me.
10. As a blog reader, I want to see which articles are part of a series, so that I can follow sequential content.

## Implementation Decisions

### Tier 1: High Impact, Moderate Effort

#### 1. Scholarship Comparison Drawer

A global comparison store (`useComparisonStore` via Zustand) tracking selected scholarship IDs. A "Compare" toggle on each card (max 3 selections). A sticky bottom bar that animates up when items are selected, showing mini thumbnails and a "Compare" button. The comparison modal is a full-screen overlay with a side-by-side table: amount, deadline, rating, category, description. This is the pattern that differentiated Airbnb's listing experience.

**New files**: `src/stores/comparison.ts`, `src/components/scholarships/comparison-drawer.tsx`, `src/components/scholarships/comparison-modal.tsx`

#### 2. Deadline Urgency Visualization

A thin colored arc or progress bar along the card edge that fills based on deadline proximity. Deadlines within 30 days: terracotta arc. 30-90 days: sage. Beyond 90 days: outline-variant. Implementation: compute `differenceInDays` from deadline, render an SVG circle segment or CSS gradient border.

**Components affected**: `scholarship-card.tsx`

#### 3. Blog Editorial Hero Card

A full-width featured post card at the top of the blog listing. Post image fills `aspect-[21/9]` with vertical gradient overlay. Title in Noto Serif at 40-48px overlaid on the image. Category pill, publish date, read time, and "Read" arrow below. This single card communicates "this is a publication, not a list."

**New component**: Already proposed in Module 3 as `BlogCardFeatured` — this enhancement makes it full-bleed with image overlay rather than a simple horizontal layout.

### Tier 2: Medium Impact, Medium Effort

#### 4. Card Flip on Hover

Desktop-only: on hover, the scholarship card rotates 180deg on the Y-axis to reveal a "back" face with eligibility requirements, apply link, mini deadline countdown, and save button. Uses Motion's `rotateY` with `backfaceVisibility: "hidden"`. Only implement this if the expanded modal CTA (Module 2) is removed — two competing interaction models on one card creates confusion.

**Components affected**: `scholarship-card.tsx`

#### 5. Pull Quote Component

A dedicated `PullQuote` component for blog articles. Breaks out of the prose column to full width. Large decorative quotation marks in `text-primary/10`, centered quote in Noto Serif at 28-32px, attribution in small Poppins caps. These break monotony in long-form text and give articles visual landmarks.

**New component**: `src/components/blog/pull-quote.tsx`

#### 6. Article Series Grouping

Extend `BlogPost` with `series?: { name: string; part: number; totalParts: number }`. Articles in a series display a "Part 2 of 4" indicator and a mini series-navigation widget in the sidebar. Drives sequential reading engagement.

**Components affected**: `blog-posts.ts`, `blog-detail.tsx`

#### 7. Contact "Open Letter" Layout

Structure the contact page as an editorial open letter. Full-width Noto Serif: "Dear Student," opening the page, followed by 3 short paragraphs about the team's mission. Email CTA becomes a "Write Back" button. Reinforces the literary journal aesthetic.

**Components affected**: `contact-form-section.tsx` or new `contact-letter.tsx`

### Tier 3: High Impact, High Effort

#### 8. Scholarship Match Score

A client-side "Match %" badge computed from user-input criteria (discipline, year, GPA range) stored in local state or Zustand. Cards get a `92% match` badge. The match calculation is entirely client-side on first iteration — no backend ML required. Requires a profile/preferences input UI.

**New files**: `src/stores/profile.ts`, `src/components/scholarships/match-badge.tsx`, `src/components/ui/profile-setup.tsx`

#### 9. Scroll-Driven Category Navigation

Replace the tab filter on the scholarships page with a sticky category indicator that highlights the current section as users scroll through grouped-by-category cards. Large typographic section headers as editorial dividers between groups. Transforms the page into a continuous editorial narrative.

**Components affected**: `scholarship-grid.tsx`, `scholarship-filters.tsx`

### Tier 4: Delight Details

#### 10. Reading Completion Celebration

When the user reaches 100% scroll in a blog article, the reading progress dots turn from `bg-primary` to `bg-secondary` (sage green), percentage scales up briefly, label changes to "Article Complete." A tiny dopamine moment aligned with the educational platform's goals.

**Components affected**: `reading-progress.tsx`

#### 11. Reading Time Visual Bars

In the blog grid, 5 tiny vertical bars beneath card metadata. Bars fill proportionally to read time (5 min = 1 bar, 15+ min = all 5). Replaces text with scannable visual data.

**Components affected**: `blog-card.tsx`

#### 12. Animated Topographic Background

A very subtle SVG topographic line pattern as a full-bleed background on the contact page. Warm brown palette at 4-6% opacity. Adds visual texture without competing with content.

**Components affected**: `contact/page.tsx` or `globals.css`

#### 13. Global Article Progress Line

A 2px `position: fixed; top: 0` progress bar on blog detail pages only. Universally used by premium publications (The Verge, Medium, Substack). One-component addition.

**New component**: `src/components/blog/article-progress-bar.tsx`

## Testing Decisions

- **Modules to test**: Comparison store (unit test: add/remove items, max 3 enforcement), match score calculation (unit test: criteria matching logic), card flip animation (Playwright: hover triggers rotation, back face content visible)
- **Prior art**: Existing Zustand store patterns in `src/stores/`

## Out of Scope

- Backend AI/ML for scholarship matching (client-side only)
- User accounts or persistent profiles (local storage only)
- Social features (sharing, comments)
- Real-time notifications

## Further Notes

- These features should be implemented selectively based on user impact and team capacity. Not all 13 need to ship.
- The comparison drawer (Tier 1) and deadline urgency visualization (Tier 1) are the highest-ROI features for the scholarship discovery experience specifically.
- The editorial hero card and pull quote component are the highest-ROI features for blog credibility.
- Consider A/B testing the card flip vs. expanded modal approach before committing to one.
