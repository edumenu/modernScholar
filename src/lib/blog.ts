import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"
import matter from "gray-matter"
import readingTime from "reading-time"
import { z } from "zod"

import { authors, type AuthorKey, type BlogAuthor } from "@/data/blog-authors"
import enrichedScholarships from "@/data/scholarships-enriched.json"
import { slugify } from "@/lib/utils"

// --- Public Types -----------------------------------------------------------

export type { AuthorKey, BlogAuthor } from "@/data/blog-authors"

export interface BlogSeries {
  name: string
  part: number
  totalParts: number
}

export interface BlogHeading {
  id: string
  title: string
}

export interface BlogPost {
  // Filename-derived (canonical)
  slug: string

  // Frontmatter (validated)
  title: string
  excerpt: string
  category: string
  publishDate: string // ISO 8601 (YYYY-MM-DD or full ISO)
  updatedDate?: string
  tags: string[]
  series?: BlogSeries
  featured: boolean
  status: "draft" | "published"
  seoDescription: string
  ogImage?: string
  coverCredit?: string
  relatedScholarships: string[]

  // Display-ready (joined / computed)
  /** Cover image (frontmatter `coverImage` or default fallback). Downstream consumers expect `image`. */
  image: string
  /** Joined from author registry. */
  author: BlogAuthor
  /** Computed via `reading-time`. Format: `"N min read"`. */
  readTime: string
  /**
   * Section headings extracted from the MDX body (h3 / `### `). Used by the
   * blog detail sidebar to render the table-of-contents and drive the
   * scroll-spy reading progress dots. Heading IDs match what the MDX h3
   * renderer produces via `slugify(text)`.
   */
  headings: BlogHeading[]
}

// --- Constants --------------------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), "content", "blog")
const DEFAULT_COVER_IMAGE = "/blog/default-cover.jpg"
const ALL_AUTHOR_KEYS = Object.keys(authors) as AuthorKey[]
const SCHOLARSHIP_SLUGS = new Set<string>(
  (enrichedScholarships as Array<{ id: string }>).map((s) => s.id),
)

// --- Frontmatter Schema -----------------------------------------------------

const seriesSchema = z.object({
  name: z.string().min(1),
  part: z.number().int().positive(),
  totalParts: z.number().int().positive(),
})

const isoDateRegex = /^\d{4}-\d{2}-\d{2}/

export const FrontmatterSchema = z.object({
  // Required
  title: z.string().min(1, "title is required"),
  excerpt: z.string().min(1, "excerpt is required"),
  category: z.string().min(1, "category is required"),
  publishDate: z
    .string()
    .regex(isoDateRegex, "publishDate must start with ISO date (YYYY-MM-DD)"),
  author: z.enum(ALL_AUTHOR_KEYS as [AuthorKey, ...AuthorKey[]]),

  // Optional
  coverImage: z.string().optional(),
  updatedDate: z
    .string()
    .regex(isoDateRegex, "updatedDate must start with ISO date (YYYY-MM-DD)")
    .optional(),
  tags: z.array(z.string()).optional(),
  series: seriesSchema.optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  coverCredit: z.string().optional(),
  relatedScholarships: z.array(z.string()).optional(),
})

export type Frontmatter = z.infer<typeof FrontmatterSchema>

// --- Internals --------------------------------------------------------------

/**
 * Extracts h3 (`### `) headings from a raw MDX body, skipping fenced code
 * blocks. The returned IDs use the same `slugify` rule as the MDX h3 renderer
 * in `src/components/blog/mdx-components.tsx`, so client-side
 * `document.getElementById(headings[i].id)` resolves to the rendered DOM node.
 */
function extractHeadings(body: string): BlogHeading[] {
  const lines = body.split(/\r?\n/)
  const headings: BlogHeading[] = []
  const seen = new Set<string>()
  let inCodeFence = false

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence
      continue
    }
    if (inCodeFence) continue

    const match = line.match(/^###\s+(.+?)\s*$/)
    if (!match) continue

    const title = match[1].replace(/\*\*/g, "").trim()
    if (!title) continue

    let id = slugify(title)
    if (!id) continue

    // Disambiguate duplicate slugs by appending an incrementing suffix.
    if (seen.has(id)) {
      let n = 2
      while (seen.has(`${id}-${n}`)) n++
      id = `${id}-${n}`
    }
    seen.add(id)
    headings.push({ id, title })
  }

  return headings
}

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
    .join("; ")
}

async function readPostFiles(): Promise<string[]> {
  try {
    const entries = await readdir(CONTENT_DIR, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
      .map((e) => e.name)
  } catch (err) {
    // Content dir may not exist yet (pre-migration). Return empty so build doesn't crash.
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return []
    throw err
  }
}

interface ParsedPost {
  slug: string
  filename: string
  fm: Frontmatter
  bodyRaw: string
}

async function parsePostFile(filename: string): Promise<ParsedPost> {
  const filepath = path.join(CONTENT_DIR, filename)
  const raw = await readFile(filepath, "utf8")
  const { data, content } = matter(raw)

  const result = FrontmatterSchema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Blog frontmatter error in ${filename}: ${formatZodError(result.error)}`,
    )
  }

  // Filename overrides any frontmatter slug to prevent drift.
  const slug = filename.replace(/\.mdx$/, "")

  return { slug, filename, fm: result.data, bodyRaw: content }
}

function buildPost(parsed: ParsedPost): BlogPost {
  const { slug, filename, fm, bodyRaw } = parsed

  // Validate relatedScholarships against scholarships-enriched.json.
  const related = fm.relatedScholarships ?? []
  for (const refSlug of related) {
    if (!SCHOLARSHIP_SLUGS.has(refSlug)) {
      throw new Error(
        `Blog frontmatter error in ${filename}: relatedScholarships contains unknown scholarship slug "${refSlug}".`,
      )
    }
  }

  const author = authors[fm.author]
  // `z.enum` already guarantees fm.author is a valid AuthorKey, but be defensive.
  if (!author) {
    throw new Error(
      `Blog frontmatter error in ${filename}: unknown author key "${fm.author}".`,
    )
  }

  const minutes = Math.max(1, Math.round(readingTime(bodyRaw).minutes))
  const headings = extractHeadings(bodyRaw)

  return {
    slug,
    title: fm.title,
    excerpt: fm.excerpt,
    category: fm.category,
    publishDate: fm.publishDate,
    updatedDate: fm.updatedDate,
    tags: fm.tags ?? [],
    series: fm.series,
    featured: fm.featured ?? false,
    status: fm.status ?? "published",
    seoDescription: fm.seoDescription ?? fm.excerpt,
    ogImage: fm.ogImage ?? fm.coverImage,
    coverCredit: fm.coverCredit,
    relatedScholarships: related,
    image: fm.coverImage ?? DEFAULT_COVER_IMAGE,
    author,
    readTime: `${minutes} min read`,
    headings,
  }
}

// --- Public API -------------------------------------------------------------

/**
 * Loads, validates, and sorts every MDX post in `content/blog/`.
 *
 * - Filename is the canonical slug (overrides any frontmatter slug).
 * - Fails loudly on: duplicate slugs, unknown author key, missing required
 *   frontmatter field, or unknown `relatedScholarships` slug.
 * - Drops `status: draft` posts when `NODE_ENV === "production"`.
 * - Sorts newest-first by `publishDate`.
 * - Cached per build via `React.cache` so multiple page renders during static
 *   generation don't re-parse the filesystem.
 */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const filenames = await readPostFiles()

  const parsed = await Promise.all(filenames.map(parsePostFile))

  // Duplicate slug detection (filename collisions are impossible on POSIX, but a
  // case-insensitive collision on macOS/Windows can sneak through, and explicit
  // validation produces a clearer error than a silent override).
  const seen = new Map<string, string>()
  for (const p of parsed) {
    const existing = seen.get(p.slug)
    if (existing) {
      throw new Error(
        `Duplicate blog slug "${p.slug}" in ${existing} and ${p.filename}.`,
      )
    }
    seen.set(p.slug, p.filename)
  }

  let posts = parsed.map(buildPost)

  if (process.env.NODE_ENV === "production") {
    posts = posts.filter((p) => p.status !== "draft")
  }

  // Newest first.
  posts.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  )

  return posts
})

/** Returns the post matching `slug` or `null` if none exists. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

/**
 * Picks up to `limit` related posts for the given post.
 *
 * Ranking (high → low):
 *   1. Same series (excluding the post itself)
 *   2. Tag-overlap count (more shared tags ranks higher)
 *   3. Same category
 *   4. Tiebreaker: newer `publishDate`
 */
export async function getRelatedPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  const all = await getAllPosts()
  const candidates = all.filter((p) => p.slug !== post.slug)

  const postTags = new Set(post.tags)

  function scoreOf(p: BlogPost): { tier: number; tagOverlap: number } {
    // Tier 0 = best. Lower tier wins.
    if (post.series && p.series && p.series.name === post.series.name) {
      return { tier: 0, tagOverlap: 0 }
    }
    const overlap = p.tags.filter((t) => postTags.has(t)).length
    if (overlap > 0) {
      return { tier: 1, tagOverlap: overlap }
    }
    if (p.category === post.category) {
      return { tier: 2, tagOverlap: 0 }
    }
    return { tier: 3, tagOverlap: 0 }
  }

  const scored = candidates.map((p) => ({ post: p, score: scoreOf(p) }))

  scored.sort((a, b) => {
    if (a.score.tier !== b.score.tier) return a.score.tier - b.score.tier
    if (a.score.tagOverlap !== b.score.tagOverlap) {
      return b.score.tagOverlap - a.score.tagOverlap
    }
    return (
      new Date(b.post.publishDate).getTime() -
      new Date(a.post.publishDate).getTime()
    )
  })

  return scored.slice(0, limit).map((s) => s.post)
}
