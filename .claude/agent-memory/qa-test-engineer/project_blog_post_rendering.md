---
name: Blog post rendering quirks
description: /blog/[slug] duplicates the excerpt as the first body paragraph, and uses H3 for in-post sections (skipping H2)
type: project
---

Two layout-level quirks confirmed on /blog/how-to-write-a-winning-scholarship-essay during 2026-05-17 mobile audit:

1. **Excerpt rendered twice**: Article hero displays title + excerpt + cover image. The first body paragraph then repeats the exact excerpt text. Likely the MDX `description` frontmatter is shown in the hero AND the source markdown begins with the same sentence (per the project's blog convention "First descriptive sentence becomes the excerpt").

2. **Heading hierarchy skips H2 in the article body**: H1 (post title) → H3 (in-post sections). The `convert:blogs` script emits `### ` for in-post `### ` sources. Related Blogs region below uses H2 — so H2 exists on the page, just not in the article.

**Why:** The conversion convention may be intentional (preserve H1 → H3 outside the article context where H2 is reserved for sibling regions). But it violates WCAG 1.3.1 logical nesting.

**How to apply:** When reviewing /blog/[slug] layouts or auditing the `npm run convert:blogs` script, surface both issues. Suggest either (a) layout skips first MDX paragraph when it equals frontmatter.description, or (b) source `### ` becomes `<h2>` in the rendered output.
