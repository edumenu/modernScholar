import fs from "node:fs"
import path from "node:path"
import slugify from "slugify"

const SOURCE_PATH = path.resolve(__dirname, "../ScholarshipBlogs.md")
const CONTENT_DIR = path.resolve(__dirname, "../content/blog")
/**
 * New authoring loop for blog posts:
  # 1. Edit ScholarshipBlogs.md — add a `## **Title**` section with a meta line
  # 2. Run: npm run convert:blogs
  # 3. (Optional) edit the generated content/blog/<slug>.mdx to add tags/series/PullQuote/InlineScholarshipCard
  # 4. Build: npm run build
 */

const VALID_AUTHORS = new Set([
  "Cathy Dumenu"
])

type SectionMeta = {
  author: string
  category: string
  date: string
  cover: string
}

type ParsedPost = {
  title: string
  slug: string
  meta: SectionMeta
  body: string
}

function parseMetaLine(line: string): Partial<SectionMeta> {
  const match = line.match(/^<!--\s*(.+?)\s*-->$/)
  if (!match) return {}
  const inner = match[1]
  const out: Record<string, string> = {}
  for (const pair of inner.split(";")) {
    const idx = pair.indexOf(":")
    if (idx < 0) continue
    const key = pair.slice(0, idx).trim()
    const value = pair.slice(idx + 1).trim()
    if (key) out[key] = value
  }
  return out as Partial<SectionMeta>
}

function splitSections(source: string): ParsedPost[] {
  const lines = source.split(/\r?\n/)
  const posts: ParsedPost[] = []

  let i = 0
  while (i < lines.length) {
    const titleMatch = lines[i].match(/^##\s+\*\*(.+)\*\*\s*$/)
    if (!titleMatch) {
      i++
      continue
    }
    const title = titleMatch[1].trim()
    i++

    // Skip blank lines until meta or content.
    while (i < lines.length && lines[i].trim() === "") i++

    let meta: Partial<SectionMeta> = {}
    if (i < lines.length && lines[i].trim().startsWith("<!--")) {
      meta = parseMetaLine(lines[i].trim())
      i++
    }

    // Collect body until next "## **" or EOF.
    const bodyLines: string[] = []
    while (i < lines.length && !/^##\s+\*\*(.+)\*\*\s*$/.test(lines[i])) {
      bodyLines.push(lines[i])
      i++
    }

    const body = bodyLines.join("\n").trim()
    if (!body) {
      console.warn(`[skip] "${title}" — title-only section, no body.`)
      continue
    }

    if (
      !meta.author ||
      !meta.category ||
      !meta.date ||
      !meta.cover
    ) {
      console.error(
        `[error] "${title}" — meta line missing required field. Found: ${JSON.stringify(meta)}`,
      )
      console.error(
        `        expected: <!-- author: <key>; category: <cat>; date: <YYYY-MM-DD>; cover: <filename> -->`,
      )
      process.exit(1)
    }

    if (!VALID_AUTHORS.has(meta.author)) {
      console.error(
        `[error] "${title}" — unknown author "${meta.author}". Valid: ${[...VALID_AUTHORS].join(", ")}.`,
      )
      process.exit(1)
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
      console.error(
        `[error] "${title}" — date "${meta.date}" is not ISO YYYY-MM-DD.`,
      )
      process.exit(1)
    }

    const slug = slugify(title, { lower: true, strict: true })

    posts.push({
      title,
      slug,
      meta: meta as SectionMeta,
      body,
    })
  }

  return posts
}

// Wrap the paragraph after each "What to do instead:" line in a <Callout type="tip">.
function transformInsteadBlocks(body: string): string {
  const lines = body.split("\n")
  const out: string[] = []

  let i = 0
  while (i < lines.length) {
    if (/^What to do instead:\s*$/.test(lines[i].trim())) {
      // Find the next non-empty paragraph and wrap it.
      i++
      // Skip blank lines.
      while (i < lines.length && lines[i].trim() === "") i++
      const para: string[] = []
      while (i < lines.length && lines[i].trim() !== "") {
        para.push(lines[i])
        i++
      }
      if (para.length > 0) {
        out.push("<Callout type=\"tip\">")
        out.push("")
        out.push(para.join("\n"))
        out.push("")
        out.push("</Callout>")
      }
      continue
    }
    out.push(lines[i])
    i++
  }

  return out.join("\n").trim()
}

// First sentence of body (before the first ### or list/blockquote) becomes the excerpt.
function deriveExcerpt(body: string): string {
  const firstParagraph = body.split(/\n\s*\n/).find((p) => {
    const t = p.trim()
    return t && !t.startsWith("#") && !t.startsWith("-") && !t.startsWith(">")
  })
  if (!firstParagraph) return ""
  // Take up to the first sentence-ending punctuation.
  const m = firstParagraph.trim().match(/^([^.!?]+[.!?])/)
  return (m ? m[1] : firstParagraph).trim()
}

function emitMdx(post: ParsedPost): string {
  const excerpt = deriveExcerpt(post.body)
  const transformedBody = transformInsteadBlocks(post.body)

  // Escape double-quotes in YAML strings.
  const yamlSafe = (s: string) => s.replace(/"/g, '\\"')

  const frontmatter = [
    "---",
    `title: "${yamlSafe(post.title)}"`,
    `excerpt: "${yamlSafe(excerpt)}"`,
    `category: "${yamlSafe(post.meta.category)}"`,
    `publishDate: "${post.meta.date}"`,
    `author: "${yamlSafe(post.meta.author)}"`,
    `coverImage: /blog/${post.meta.cover}`,
    "---",
    "",
  ].join("\n")

  return frontmatter + transformedBody + "\n"
}

function main() {
  const force = process.argv.includes("--force")

  if (!fs.existsSync(SOURCE_PATH)) {
    console.error(`Source not found: ${SOURCE_PATH}`)
    process.exit(1)
  }
  fs.mkdirSync(CONTENT_DIR, { recursive: true })

  const source = fs.readFileSync(SOURCE_PATH, "utf-8")
  const posts = splitSections(source)

  if (posts.length === 0) {
    console.warn("No posts parsed from ScholarshipBlogs.md.")
    return
  }

  const seenSlugs = new Set<string>()
  let written = 0
  let skipped = 0

  for (const post of posts) {
    if (seenSlugs.has(post.slug)) {
      console.error(
        `[error] duplicate slug "${post.slug}" derived from title "${post.title}".`,
      )
      process.exit(1)
    }
    seenSlugs.add(post.slug)

    const outPath = path.join(CONTENT_DIR, `${post.slug}.mdx`)
    if (fs.existsSync(outPath) && !force) {
      console.log(`[skip] ${post.slug}.mdx exists (use --force to overwrite)`)
      skipped++
      continue
    }

    fs.writeFileSync(outPath, emitMdx(post), "utf-8")
    console.log(`[write] ${post.slug}.mdx`)
    written++
  }

  console.log(`\nDone. ${written} written, ${skipped} skipped.`)
}

main()
