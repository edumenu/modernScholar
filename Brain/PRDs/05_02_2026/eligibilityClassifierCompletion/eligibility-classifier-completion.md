# Eligibility Classifier Completion

> Part 2 of the Architecture Deepening series. See `architecture-deepening-overview.md`. Complements the prior UX-focused PRD `Brain/PRDs/04_29_2026/eligibility-tag-filters.md`, which assumed the substrate this PRD now provides.

## Problem Statement

The eligibility tag filtering feature on the `feature/eligibility-tag-filters` branch is half-built and currently does nothing for the user:

- The tagger script `scripts/tag-eligibilities.ts` was committed in `408d305` and then removed; it is not in the working tree and not in `package.json`.
- The `Scholarship` type in `src/data/scholarships.ts` (lines 36–49) has no `eligibilityTags` field.
- The `EnrichedScholarship` type in `scripts/utils.ts` (lines 26–40) has no `eligibilityTags` field.
- `src/data/scholarships-enriched.json` does not carry `eligibilityTags` on any entry.
- `src/lib/scholarship-utils.ts` `filterAndSort` only filters by `level` and free-text search; there is no `matches`/`matchesEligibilityTags` function.
- `src/components/scholarships/scholarship-filters.tsx` lines 300–371 contain a commented-out filter dropdown labelled "Filters" with placeholder tags `featured`, `popular`, `new`, `topPick` — not the eligibility taxonomy.

Beyond being incomplete, the previous design — recovered from git — also distributed the tag taxonomy across three places: a hand-edited list of regex rules in the script, an implicit set of expected tag strings in any future runtime filter, and a hand-curated set of checkbox items in the UI. Each place would need to be updated together; nothing in the type system enforces that.

## Location

`Brain/PRDs/05_02_2026/eligibility-classifier-completion.md`

## Solution

Extract the tag taxonomy, the prose-to-tags rule set, and the matching predicate into one deep module at `src/lib/eligibility.ts`. The build script becomes a thin file-I/O adapter that imports `classify()` from this module. The runtime filter (`filterAndSort`) accepts a `selectedTags: Tag[]` parameter and delegates to `matches()`. The filter UI renders checkboxes from `TAG_GROUPS` exported by the module.

This both finishes the feature (the user gets working tag filters as described in the prior UX PRD) and pays down the architectural debt that caused the half-built state in the first place: the taxonomy now lives in one file, and adding a tag is a one-edit change.

## User Stories

Developer-facing:

1. As a developer, I want to add a new eligibility tag (e.g., "Religious Affiliation") in one file and have the build script, runtime filter, and UI all see it without further edits.
2. As a developer, I want the `Tag` type to be a string-literal union so that the compiler catches typos in any reference to a tag value.
3. As a developer, I want one place to look when a scholarship is mistagged so that fixing the rule does not require coordinating edits across script and UI.
4. As a developer, I want the `eligibilityTags` field to be present on every entry of `scholarships-enriched.json` so that the runtime filter has data to operate on.
5. As a developer, I want the build script to be testable without spinning up Node file-I/O fixtures, by separating the rule engine from the I/O wrapper.

User-facing (from prior PRD `04_29_2026/eligibility-tag-filters.md`):

6. As a student, I want to filter scholarships by eligibility tags such as "Need-Based", "Merit-Based", "First-Generation", or category tags such as "Race/Ethnicity: African American/Black".
7. As a student selecting multiple options within a category, I want OR semantics (selecting both "Hispanic/Latino" and "African American/Black" shows scholarships matching either).
8. As a student selecting tags across categories, I want AND semantics across groups but OR within a group, matching the prior PRD's composition rules.
9. As a student with no tag selection, I want all scholarships visible (the empty-selection passthrough preserves today's behaviour).

## Implementation Decisions

### New module: `src/lib/eligibility.ts`

This module is the single source of truth for the eligibility taxonomy.

**Type exports:**

- `type Tag` — string-literal union of all 26 valid tag values. Includes flat tags (`"Need-Based"`, `"Merit-Based"`, `"First-Generation"`, `"State-Specific"`, `"Athletic"`, `"Creative/Arts"`) and category tags using a `"Category:Value"` shape (`"Race/Ethnicity:African American/Black"`, `"Major-Specific:STEM/Engineering"`, etc.).
- `type TagGroup` — `{ category: string; tags: readonly Tag[] }` describing UI-renderable groupings.

**Value exports:**

- `const ALL_TAGS: readonly Tag[]` — the full taxonomy as a flat array.
- `const TAG_GROUPS: readonly TagGroup[]` — the taxonomy organized for UI rendering with category headers ("Race/Ethnicity", "Disability/Health", etc.) plus their child tags. Flat tags sit in their own group at the top.

**Function exports:**

- `function classify(eligibilityText: string): Tag[]` — runs the rule set against free-text eligibility prose and returns deduplicated tags. Pure; returns `[]` for empty or unmatched input.
- `function matches(scholarship: { eligibilityTags: Tag[] }, selected: readonly Tag[]): boolean` — implements the prior PRD's composition rules: empty selection passes everything through; non-empty selection requires AND across categories and OR within a category.

### Composition semantics for `matches`

`matches` interprets `selected` by parsing each tag's category prefix (everything before the `:`, or `"flat"` for flat tags) and grouping by category. A scholarship matches if for every selected category at least one tag in that category is present on the scholarship.

Worked example:

- `selected = ["Race/Ethnicity:African American/Black", "Race/Ethnicity:Hispanic/Latino", "Need-Based"]`
- Grouped: `{ "Race/Ethnicity": ["…African American/Black", "…Hispanic/Latino"], "flat": ["Need-Based"] }`
- A scholarship matches if (it has either of the two race tags) AND (it has `Need-Based`).

This matches user stories 7 and 8 above.

### Restoring `scripts/tag-eligibilities.ts` as a thin adapter

The script becomes a small file-I/O wrapper:

1. Read `src/data/scholarships-enriched.json`.
2. For each entry, set `entry.eligibilityTags = classify(entry.eligibility ?? "")`.
3. Write the JSON back, preserving formatting.
4. Print a tag distribution and any untagged-scholarship summary for manual review.

The 32 regex rules previously inlined in the script move into the module's private rule table. The script no longer knows what tags exist or how to map prose to them — only how to load and persist scholarships.

The `package.json` `scripts` block gains `"tag-eligibilities": "npx tsx scripts/tag-eligibilities.ts"`.

### Inline tagging during scrape

`scripts/scrape-scholarships.ts` already produces `scholarships-enriched.json` directly. After this change it imports `classify` and assigns `eligibilityTags` inline at line ~140 (where `eligibility` is read from CSV). A user who runs `npm run scrape-scholarships` gets a fully tagged JSON in one pass without remembering to also run `tag-eligibilities`. The `tag-eligibilities` script remains useful for retagging an existing JSON without re-scraping.

### Type changes

- `src/data/scholarships.ts` `Scholarship` interface gains `eligibilityTags: Tag[]` (imported from `src/lib/eligibility.ts`). Required field; the JSON is regenerated to populate it.
- `scripts/utils.ts` `EnrichedScholarship` interface gains the same field.

### Filter wiring

`src/lib/scholarship-utils.ts` `filterAndSort` signature gains a fifth parameter:

```
filterAndSort(items, level, searchQuery, sortBy, selectedTags)
```

Behaviour:

- `selectedTags` defaults to `[]` and is treated as "no tag filter" — current behaviour preserved.
- When `selectedTags.length > 0`, items where `matches(scholarship, selectedTags)` returns `false` are **excluded** outright (hard filter), per the prior PRD's `"non-matching hidden, not dimmed"` rule. The level filter retains its dim-tail semantics independently.

### UI

- `src/components/scholarships/scholarship-filters.tsx` lines 300–371 — replace the commented-out dropdown with a real filter sheet trigger that opens a right-side `Sheet` with checkbox lists generated from `TAG_GROUPS`. Implementation details (animated checkboxes, sticky footer with live count, active filter chip strip) are specified in the prior UX PRD `04_29_2026/eligibility-tag-filters.md`.
- `src/components/scholarships/scholarship-filters-mobile.tsx` — same checkbox lists inside the existing bottom sheet.

The UI imports `ALL_TAGS`, `TAG_GROUPS`, and the `Tag` type from `src/lib/eligibility.ts` only — no rule strings, no regexes.

### Data regeneration

After landing the module + script + types, run either `npm run scrape-scholarships` or `npm run tag-eligibilities` and commit the regenerated `scholarships-enriched.json` in the same PR.

## Testing Decisions

### Modules to Test

- `src/lib/eligibility.ts` — primary surface. Cases:
  - `classify("Be a graduating senior… 3.75 GPA… financial need")` returns a list including `"Need-Based"` and `"Merit-Based"`.
  - `classify("")` and `classify("Open to all students")` return `[]`.
  - `matches({ eligibilityTags: [] }, [])` returns `true`.
  - `matches({ eligibilityTags: ["Need-Based"] }, ["Merit-Based"])` returns `false`.
  - `matches({ eligibilityTags: ["Need-Based", "Merit-Based"] }, ["Need-Based"])` returns `true`.
  - `matches({ eligibilityTags: ["Race/Ethnicity:Hispanic/Latino", "Need-Based"] }, ["Race/Ethnicity:African American/Black", "Race/Ethnicity:Hispanic/Latino", "Need-Based"])` returns `true` (OR within category, AND across).
  - Round-trip integrity: every tag returned by `classify` is included in `ALL_TAGS`.
- `src/lib/scholarship-utils.ts` — extend existing `sort-by-filter.test.ts` with cases proving:
  - Empty `selectedTags` reproduces today's output exactly.
  - Non-empty `selectedTags` excludes non-matching items rather than dimming them.

### Prior Art

- `src/components/scholarships/__tests__/sort-by-filter.test.ts` — `filterAndSort` test patterns.
- The deleted `tag-eligibilities.ts` from commit `408d305` — recoverable reference for the 32 regex rules that move into the module.

## Out of Scope

- Award-amount range filtering. Specified in the prior PRD; deferred from this refactor.
- URL-state persistence for `selectedTags`. The filter hook PRD (`scholarship-filters-hook.md`) handles URL hydration centrally.
- Active filter chip strip, sticky sheet footer, animated checkboxes, animated number displays. All specified in the prior UX PRD; this PRD only ships the substrate plus a minimum-viable checkbox list to wire them through.
- Tag editing UI / admin interface. Tags are derived from the eligibility prose, not user-editable.
- AI-generated tags or scoring. Pure regex rules continue.

## Further Notes

- The 32 regex rules from commit `408d305` are recovered verbatim into the new module's private rule table. If a rule needs revising (e.g., a too-aggressive `\bblack\b` match), it is now a one-line edit in one file.
- The `Tag` union increases TypeScript compile time slightly; negligible for a project of this size.
- After this PR, the `feature/eligibility-tag-filters` branch's intent is satisfied; the prior UX work in `04_29_2026/eligibility-tag-filters.md` can proceed against a real data substrate.
- Open question: should `classify` be deterministic across runs even when rule order changes? Today it returns rules in declaration order; consider sorting the output for stable JSON diffs.
