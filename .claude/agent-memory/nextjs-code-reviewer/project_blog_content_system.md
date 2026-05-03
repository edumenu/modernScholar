---
name: Blog Content System Architecture
description: MDX blog content system review: data layer, dynamic import pattern, dynamicParams gap, static export constraint, convert script quirks, test patterns
type: project
---

MDX-based blog replaces static `src/data/blog-posts.ts`. Content lives in `content/blog/*.mdx`, parsed by `src/lib/blog.ts` (gray-matter + zod validation), rendered via dynamic `import(`content/blog/${slug}.mdx`)` in `src/app/blog/[slug]/page.tsx`.

**Why:** Enables real authored content with frontmatter validation, reading-time, heading extraction, and a series/related-posts graph.

**Key architectural facts to remember:**
- `dynamicParams = false` is missing from `src/app/blog/[slug]/page.tsx` — with `output: "export"`, unrecognised slugs silently 404 at runtime rather than at build. Under a server-runtime this would be a hard 404 blocker.
- `body: ReactNode` on `BlogPost` is typed as `ReactNode` but carries a raw `string` in practice. The `BlogDetailContent` accepts `body?: ReactNode`, so it works at runtime, but the type contract is a lie that could mislead callers.
- `blog/page.tsx` passes the full `posts` array to `<BlogGrid>` (client component) — wrapping in Suspense doesn't defer that data; the Suspense fallback fires only if BlogGrid itself were async (it isn't). The Suspense wrapper is effectively decorative.
- `React.cache` busts per-import via `vi.resetModules()` in tests — valid pattern for this project.
- The `slugify` in `scripts/convert-blogs.ts` uses the `slugify` npm package (with `lower:true, strict:true`) while `src/lib/utils.ts` has a custom NFKD implementation. These produce the same output in common cases but could diverge for accented characters.
- `InlineScholarshipCard` throws on unknown slug (build-time safety), but that means a bad MDX file crashes `npm run build` with no guidance to the author. A dev-only console warning + graceful fallback would be safer.
- OG image URL in `generateMetadata` is passed as a relative path string, not an absolute URL. This may cause broken OG cards depending on crawler behaviour.
- `coverflow-carousel.tsx`: `willChange: "transform"` is set statically on every card in the DOM, not just visible ones — this promotes all cards to compositor layers simultaneously.

**How to apply:** Use these facts when reviewing future blog-related changes or advising on build pipeline issues.
