# ADR 0005 — `ScholarshipBlogs.md` is the single source of truth for blog posts

**Status:** Accepted
**Date:** 2026-05

## Context

Blog posts are authored by a non-developer (Cathy). MDX is powerful but the editing experience requires understanding JSX and frontmatter. Round-tripping between a Google Doc and `content/blog/<slug>.mdx` was error-prone.

## Decision

All blog text is authored in a single Markdown file, `ScholarshipBlogs.md`, with a simple convention:

```
## **Post Title**
<!-- author: …; category: …; date: …; cover: … -->

First descriptive sentence becomes the excerpt.

## Section heading

Body…
```

`npm run convert:blogs` converts each `## **Bold**` block into a `content/blog/<slug>.mdx` file. The conversion script:

- Refuses to overwrite existing MDX files unless `--force` is passed (manual MDX enrichments survive).
- Auto-wraps `What to do instead:` paragraphs in `<Callout type="tip">`.
- Derives the excerpt from the first non-heading sentence.

## Why

- One file to author in. Author never touches MDX directly.
- `<PullQuote>`, `<InlineScholarshipCard>`, tags, series, relatedScholarships — all manual enrichments — are preserved across regenerations.
- Diffs to `ScholarshipBlogs.md` are easy to review.

## Consequences

- AI must not directly create files under `content/blog/`. Add to `ScholarshipBlogs.md` and run the converter.
- The converter is rule-driven; any new content convention (e.g., new auto-callout type) requires updating `scripts/convert-blogs.ts`.
- See `.claude/rules/content-authoring.md` for working rules.
