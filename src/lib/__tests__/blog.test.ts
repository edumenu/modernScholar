import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

// We mock `node:fs/promises` so getAllPosts reads from in-memory fixtures
// instead of touching content/blog/. Each test sets `mockFiles` to the
// desired filename->raw-string map, then re-imports `../blog` after
// `vi.resetModules()` to bust React.cache.

interface MockFiles {
  [filename: string]: string
}

let mockFiles: MockFiles = {}

vi.mock("node:fs/promises", () => ({
  readdir: vi.fn(async () => {
    return Object.keys(mockFiles).map((name) => ({
      name,
      isFile: () => true,
    }))
  }),
  readFile: vi.fn(async (filepath: string) => {
    const filename = filepath.split(/[\\/]/).pop() ?? ""
    if (filename in mockFiles) return mockFiles[filename]
    const err = new Error(`ENOENT: no such file ${filepath}`) as NodeJS.ErrnoException
    err.code = "ENOENT"
    throw err
  }),
}))

// Helper: build raw mdx string with frontmatter + body
function mdx(frontmatter: Record<string, unknown>, body = "Hello world."): string {
  const fmLines = ["---"]
  for (const [k, v] of Object.entries(frontmatter)) {
    if (v === undefined) continue
    if (typeof v === "string") {
      fmLines.push(`${k}: "${v.replace(/"/g, '\\"')}"`)
    } else if (Array.isArray(v)) {
      fmLines.push(`${k}: ${JSON.stringify(v)}`)
    } else if (typeof v === "object" && v !== null) {
      fmLines.push(`${k}:`)
      for (const [sk, sv] of Object.entries(v)) {
        fmLines.push(`  ${sk}: ${JSON.stringify(sv)}`)
      }
    } else {
      fmLines.push(`${k}: ${v}`)
    }
  }
  fmLines.push("---", "", body)
  return fmLines.join("\n")
}

const validBase = {
  title: "A Post",
  excerpt: "Some excerpt.",
  category: "Guides",
  publishDate: "2025-06-01",
  author: "Catherine Dumenu",
}

async function loadBlog() {
  vi.resetModules()
  return await import("../blog")
}

beforeEach(() => {
  mockFiles = {}
  vi.unstubAllEnvs()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

// --- Frontmatter validation -------------------------------------------------

describe("frontmatter validation", () => {
  it("rejects post with missing title", async () => {
    mockFiles = {
      "no-title.mdx": mdx({
        excerpt: "x",
        category: "Guides",
        publishDate: "2025-06-01",
        author: "Catherine Dumenu",
      }),
    }
    const { getAllPosts } = await loadBlog()
    await expect(getAllPosts()).rejects.toThrow(/title/i)
  })

  it("rejects post with unknown author key", async () => {
    mockFiles = {
      "bad-author.mdx": mdx({ ...validBase, author: "nobody" }),
    }
    const { getAllPosts } = await loadBlog()
    await expect(getAllPosts()).rejects.toThrow(/author/i)
  })

  it("rejects post with invalid (non-ISO) publishDate", async () => {
    mockFiles = {
      "bad-date.mdx": mdx({ ...validBase, publishDate: "June 1, 2025" }),
    }
    const { getAllPosts } = await loadBlog()
    await expect(getAllPosts()).rejects.toThrow(/publishDate/i)
  })

  it("rejects when two files reduce to the same slug", async () => {
    // Filenames must collide on the slug derived by `name.replace(/\.mdx$/, "")`.
    // We override readdir for this single call to return two entries that
    // both strip to the same slug ("dup"). readFile resolves both via the
    // single shared mockFiles entry.
    mockFiles = {
      "dup.mdx": mdx({ ...validBase, title: "A" }),
    }
    const { getAllPosts } = await loadBlog()
    const fs = await import("node:fs/promises")
    ;(fs.readdir as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { name: "dup.mdx", isFile: () => true },
      { name: "dup.mdx", isFile: () => true },
    ])
    await expect(getAllPosts()).rejects.toThrow(/[Dd]uplicate/)
  })
})

// --- Draft filtering --------------------------------------------------------

describe("draft filtering by NODE_ENV", () => {
  const draftPost = mdx({ ...validBase, title: "Draft", status: "draft" })
  const publishedPost = mdx({
    ...validBase,
    title: "Published",
    publishDate: "2025-05-01",
  })

  it("filters drafts in production", async () => {
    vi.stubEnv("NODE_ENV", "production")
    mockFiles = {
      "draft.mdx": draftPost,
      "published.mdx": publishedPost,
    }
    const { getAllPosts } = await loadBlog()
    const posts = await getAllPosts()
    expect(posts).toHaveLength(1)
    expect(posts[0].slug).toBe("published")
  })

  it("keeps drafts visible in development", async () => {
    vi.stubEnv("NODE_ENV", "development")
    mockFiles = {
      "draft.mdx": draftPost,
      "published.mdx": publishedPost,
    }
    const { getAllPosts } = await loadBlog()
    const posts = await getAllPosts()
    expect(posts).toHaveLength(2)
    expect(posts.map((p) => p.slug).sort()).toEqual(["draft", "published"])
  })
})

// --- Sort order -------------------------------------------------------------

describe("sort order", () => {
  it("sorts newest publishDate first", async () => {
    mockFiles = {
      "old.mdx": mdx({ ...validBase, title: "Old", publishDate: "2024-01-01" }),
      "new.mdx": mdx({ ...validBase, title: "New", publishDate: "2026-01-01" }),
      "mid.mdx": mdx({ ...validBase, title: "Mid", publishDate: "2025-06-15" }),
    }
    const { getAllPosts } = await loadBlog()
    const posts = await getAllPosts()
    expect(posts.map((p) => p.slug)).toEqual(["new", "mid", "old"])
  })
})

// --- readTime rounding ------------------------------------------------------

describe("readTime", () => {
  it("formats as 'N min read' and is at least 1 min for tiny posts", async () => {
    mockFiles = {
      "tiny.mdx": mdx({ ...validBase }, "Just a few words."),
    }
    const { getAllPosts } = await loadBlog()
    const posts = await getAllPosts()
    expect(posts[0].readTime).toMatch(/^\d+ min read$/)
    const minutes = parseInt(posts[0].readTime, 10)
    expect(minutes).toBeGreaterThanOrEqual(1)
  })

  it("rounds longer content to a sensible minute count", async () => {
    // ~225 wpm baseline — 1500 words should be ~6-7 min.
    const longBody = ("word ".repeat(1500)).trim()
    mockFiles = {
      "long.mdx": mdx({ ...validBase }, longBody),
    }
    const { getAllPosts } = await loadBlog()
    const posts = await getAllPosts()
    const minutes = parseInt(posts[0].readTime, 10)
    expect(minutes).toBeGreaterThanOrEqual(5)
    expect(minutes).toBeLessThanOrEqual(10)
  })
})

// --- getRelatedPosts ranking ------------------------------------------------

describe("getRelatedPosts ranking", () => {
  it("prefers same series above tag overlap, category, and recency", async () => {
    mockFiles = {
      "anchor.mdx": mdx({
        ...validBase,
        title: "Anchor",
        publishDate: "2025-01-01",
        category: "Guides",
        tags: ["finance", "essays"],
        series: { name: "Essay Mastery", part: 1, totalParts: 3 },
      }),
      "series-mate.mdx": mdx({
        ...validBase,
        title: "Series Mate",
        publishDate: "2024-01-01", // older — series should still win
        category: "News",
        tags: [],
        series: { name: "Essay Mastery", part: 2, totalParts: 3 },
      }),
      "tag-match.mdx": mdx({
        ...validBase,
        title: "Tag Match",
        publishDate: "2025-12-01",
        category: "News",
        tags: ["finance", "essays"],
      }),
      "category-match.mdx": mdx({
        ...validBase,
        title: "Category Match",
        publishDate: "2025-11-01",
        category: "Guides",
        tags: [],
      }),
      "unrelated.mdx": mdx({
        ...validBase,
        title: "Unrelated",
        publishDate: "2025-10-01",
        category: "News",
        tags: [],
      }),
    }
    const { getAllPosts, getRelatedPosts } = await loadBlog()
    const posts = await getAllPosts()
    const anchor = posts.find((p) => p.slug === "anchor")!
    const related = await getRelatedPosts(anchor, 4)
    expect(related.map((p) => p.slug)).toEqual([
      "series-mate",
      "tag-match",
      "category-match",
      "unrelated",
    ])
  })

  it("ranks higher tag-overlap above lower tag-overlap when no series match", async () => {
    mockFiles = {
      "anchor.mdx": mdx({
        ...validBase,
        title: "Anchor",
        publishDate: "2025-01-01",
        category: "Guides",
        tags: ["a", "b", "c"],
      }),
      "two-overlap.mdx": mdx({
        ...validBase,
        title: "Two",
        publishDate: "2024-01-01",
        category: "News",
        tags: ["a", "b", "z"],
      }),
      "one-overlap.mdx": mdx({
        ...validBase,
        title: "One",
        publishDate: "2025-12-01",
        category: "News",
        tags: ["a", "z"],
      }),
    }
    const { getAllPosts, getRelatedPosts } = await loadBlog()
    const posts = await getAllPosts()
    const anchor = posts.find((p) => p.slug === "anchor")!
    const related = await getRelatedPosts(anchor, 2)
    expect(related.map((p) => p.slug)).toEqual(["two-overlap", "one-overlap"])
  })

  it("extracts h2 headings from the MDX body with slugified ids", async () => {
    const body = [
      "Intro paragraph.",
      "",
      "## The Power of a Personal Story",
      "",
      "Body.",
      "",
      "## Tailoring to the Scholarship's Mission",
      "",
      "More body.",
      "",
      "```ts",
      "## Not a heading inside code",
      "```",
      "",
      "## The Power of a Personal Story",
      "",
      "Duplicate title — id should disambiguate.",
    ].join("\n")

    mockFiles = {
      "with-headings.mdx": mdx(validBase, body),
    }
    const { getAllPosts } = await loadBlog()
    const posts = await getAllPosts()
    expect(posts[0].headings).toEqual([
      { id: "the-power-of-a-personal-story", title: "The Power of a Personal Story" },
      {
        id: "tailoring-to-the-scholarships-mission",
        title: "Tailoring to the Scholarship's Mission",
      },
      {
        id: "the-power-of-a-personal-story-2",
        title: "The Power of a Personal Story",
      },
    ])
  })

  it("uses recency as the final tiebreaker within the same tier", async () => {
    mockFiles = {
      "anchor.mdx": mdx({
        ...validBase,
        title: "Anchor",
        publishDate: "2025-01-01",
        category: "Guides",
        tags: [],
      }),
      "newer-cat.mdx": mdx({
        ...validBase,
        title: "Newer Cat",
        publishDate: "2025-12-01",
        category: "Guides",
        tags: [],
      }),
      "older-cat.mdx": mdx({
        ...validBase,
        title: "Older Cat",
        publishDate: "2024-01-01",
        category: "Guides",
        tags: [],
      }),
    }
    const { getAllPosts, getRelatedPosts } = await loadBlog()
    const posts = await getAllPosts()
    const anchor = posts.find((p) => p.slug === "anchor")!
    const related = await getRelatedPosts(anchor, 2)
    expect(related.map((p) => p.slug)).toEqual(["newer-cat", "older-cat"])
  })
})

// --- getPostBySlug ----------------------------------------------------------

describe("getPostBySlug", () => {
  it("returns null for an unknown slug (does not throw)", async () => {
    mockFiles = {
      "exists.mdx": mdx({ ...validBase, title: "Exists" }),
    }
    const { getPostBySlug } = await loadBlog()
    await expect(getPostBySlug("does-not-exist")).resolves.toBeNull()
  })

  it("performs a case-sensitive slug lookup", async () => {
    mockFiles = {
      "foo.mdx": mdx({ ...validBase, title: "Foo" }),
    }
    const { getPostBySlug } = await loadBlog()
    const hit = await getPostBySlug("foo")
    const miss = await getPostBySlug("Foo")
    expect(hit?.slug).toBe("foo")
    expect(miss).toBeNull()
  })
})
