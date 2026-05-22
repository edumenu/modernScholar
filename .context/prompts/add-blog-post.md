# Prompt template — Add a new blog post

Use this when adding a new article under `content/blog/`.

## Load these rules first

- `.claude/rules/content-authoring.md`

## Steps

1. **Author the post in `ScholarshipBlogs.md`** (not in `content/blog/`). Append:

   ```
   ## **Your Post Title**
   <!-- author: Cathy Dumenu; category: Tips & Guides; date: 2026-MM-DD; cover: scholarship-X.jpg -->

   First sentence — this becomes the excerpt on the listing page.

   ## First Section Heading

   Body paragraphs…

   What to do instead:
   This paragraph automatically wraps in <Callout type="tip">.
   ```

2. **Verify the cover image exists** in `public/scholarships/`. If not, drop the image in first.

3. **Run the converter:**
   ```
   npm run convert:blogs
   ```
   This emits `content/blog/<slug>.mdx`. The script refuses to overwrite existing files; pass `--force` only when intentionally regenerating.

4. **Enrich the MDX (optional)** for things the converter can't infer:
   - Add `<PullQuote>` somewhere mid-article.
   - Add `<InlineScholarshipCard id="…" />` next to a relevant scholarship reference.
   - Add `tags`, `series`, or `relatedScholarships` to the frontmatter.

5. **Verify the route:**
   ```
   npm run build
   ```
   Build output lists every blog route. If the new one is missing, frontmatter validation failed — check author, date, cover.

6. **Spot-check** at `/blog/<slug>` in `npm run dev`.

## Don't

- Don't create `content/blog/<slug>.mdx` by hand. Author in `ScholarshipBlogs.md`.
- Don't reference an author that isn't in `src/data/blog-authors.ts`.
- Don't reference a cover filename that doesn't exist in `public/scholarships/`.
