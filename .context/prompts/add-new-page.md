# Prompt template — Add a new public page

Use this when adding a new route under `src/app/<route>/`.

## Load these rules first

- `.claude/rules/app-router.md`
- `.claude/rules/components.md`
- `.claude/rules/design-system.md`
- `.claude/rules/animation.md` (if the page has scroll-triggered content)

## Steps

1. **Decide the route shape.**
   - Static page: `src/app/<route>/page.tsx`.
   - Detail page with dynamic param: `src/app/<route>/[slug]/page.tsx` — remember `params` is a `Promise` in Next 16.
   - If multiple sibling routes share a layout, group them with `(group)/layout.tsx`.

2. **Create the page file.**
   - Server component by default. Add `"use client"` only if the top-level component itself needs it (most pages don't — push the client boundary down).
   - Export `metadata` (or `generateMetadata` for dynamic).
   - Compose section components from `src/components/<route>/` — create that folder.

3. **Extract sections.**
   - One section component per visual block (hero, list, FAQ, CTA, …).
   - Wrap each section in `<AnimatedSection animation="fadeUp">` unless it's above the fold.
   - Reuse primitives from `src/components/ui/` for buttons, cards, dialogs, etc.

4. **URL state, if applicable.**
   - Filters / search / pagination → `nuqs`. Reference `use-scholarship-filters.ts` as the pattern.

5. **Test.**
   - Add an integration test under `src/app/__tests__/<route>.test.tsx` if the page has logic. Use the `component` Vitest project.

6. **Verify.**
   - `npm run lint`
   - `npm run typecheck`
   - `npm run dev` → click through in a browser; check mobile, tablet, desktop.

## Don't

- Don't duplicate primitives into `src/components/<route>/`. Hoist to `ui/` first.
- Don't use Tailwind colors directly — only OKLCH tokens from `globals.css`.
- Don't `window.scrollTo` — Lenis owns scrolling globally.
