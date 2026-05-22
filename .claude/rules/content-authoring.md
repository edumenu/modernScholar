---
applies_to: ["content/blog/**/*.mdx", "ScholarshipBlogs.md", "scripts/convert-blogs.ts", "src/components/blog/**"]
load_when: "adding, editing, or rendering blog posts"
---

# Blog Content Authoring Rules

`ScholarshipBlogs.md` is the **single source of truth** for blog post text. The MDX files under `content/blog/` are generated. Author once, generate, then enrich the MDX with custom components.

## Adding a new post

1. Append a section to `ScholarshipBlogs.md`:

   ```
   ## **Your Post Title**
   <!-- author: Cathy Dumenu; category: Tips & Guides; date: 2026-04-01; cover: scholarship-5.jpg -->

   First descriptive sentence becomes the excerpt.

   ## First Sub-heading

   Body paragraphs...

   What to do instead:
   This paragraph auto-wraps in <Callout type="tip">.
   ```

2. `npm run convert:blogs` — emits `content/blog/<slug>.mdx`. Script refuses to overwrite existing files; pass `--force` to overwrite.

3. Edit the generated MDX to add `<PullQuote>`, `<InlineScholarshipCard>`, `tags`, `series`, or `relatedScholarships` — these are MDX-only enrichments and don't come from the source markdown.

4. `npm run build` validates frontmatter and lists the new route.

## Frontmatter contract

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Quoted string. |
| `author` | yes | Must be one of: `Cathy Dumenu`. Authors are listed in `src/data/blog-authors.ts`. |
| `category` | yes | E.g. `Tips & Guides`, `Strategy`, `Stories`. |
| `date` | yes | ISO `YYYY-MM-DD`. |
| `cover` | yes | Filename only — must exist in `public/scholarships/`. |
| `excerpt` | yes | Auto-derived from first sentence of source markdown. |
| `tags` | no | String array — manual addition. |
| `series` | no | String — manual addition. |
| `relatedScholarships` | no | Array of scholarship IDs from `src/data/scholarships.ts`. |

## Parser quirks

- The post title uses `## **Bold**`. The bold-asterisks are the title marker — plain `## ` lines pass through as h2 section headings.
- `What to do instead:` (literal phrase, case-sensitive) wraps the next paragraph in `<Callout type="tip">`.
- Manual edits to generated MDX **survive** future `npm run convert:blogs` runs (script skips existing files by default).

## Custom MDX components

Registered in `mdx-components.tsx` / `src/components/blog/mdx-components.tsx`:

- `<PullQuote>` — large editorial pull quote.
- `<Callout type="tip|note|warning">` — boxed callout.
- `<InlineScholarshipCard id="..." />` — embeds a scholarship card mid-article.
