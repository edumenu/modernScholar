# Prompt template — Add a new scholarship component

Use this when adding a component under `src/components/scholarships/`.

## Load these rules first

- `.claude/rules/components.md`
- `.claude/rules/design-system.md`
- `.claude/rules/animation.md` (if it animates)
- `.claude/rules/testing.md`
- `.context/architecture/state.md` (if it reads URL filters or comparison state)

## Steps

1. **Confirm it doesn't already exist.** Check:
   - `src/components/scholarships/` for similar names.
   - `src/components/ui/` for an existing primitive you can configure instead.

2. **Create the file:**
   ```
   src/components/scholarships/<kebab-case-name>.tsx
   ```
   - `"use client"` if it uses hooks, state, events, Motion, or browser APIs.
   - Import `cn` from `@/lib/utils`.
   - Use Base UI primitives, not Radix (exception: existing `Slider`).
   - CVA for variant props; mirror `button.tsx`.
   - Compound components use `data-slot` (mirror `card.tsx`).

3. **Hook up filters / comparison if relevant.**
   - Filters → `useScholarshipFilters()` from `src/hooks/use-scholarship-filters.ts`.
   - Comparison → `useComparisonStore` from `src/stores/comparison.ts`.

4. **Add a Storybook story:**
   ```
   src/components/scholarships/<kebab-case-name>.stories.tsx
   ```
   Mirror an existing story like `scholarship-list-card.stories.tsx`.

5. **Add tests (if behavior is non-trivial):**
   - Browser-env test in the same folder, run via `npm run test:component`.

6. **Wire it up** in `src/app/scholarships/page.tsx` or a parent section component.

7. **Verify:**
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test:component` (if you added tests)
   - `npm run storybook` → eyeball the story
   - `npm run dev` → smoke-test on /scholarships at mobile, tablet, desktop

## Don't

- Don't add the new component to `src/components/ui/` unless it's truly route-agnostic.
- Don't reach into other route folders (`home/`, `blog/`) from scholarships components.
- Don't bypass `cn()`. Don't bypass design tokens.
- Don't add a new Zustand store if `useState` + URL state can carry the data.
