import { describe, it, expect, vi } from "vitest"
import { SITE_URL } from "@/lib/constants"

// Stub the client-side React components the page eagerly imports so the
// module evaluates in a pure-node environment. We only exercise the
// `generateMetadata` export — no rendering happens here.
vi.mock("@/components/blog/blog-detail", () => ({
  BlogDetail: () => null,
}))
vi.mock("@/components/blog/blog-detail-content", () => ({
  BlogDetailContent: () => null,
}))
vi.mock("@/components/blog/related-posts", () => ({
  RelatedPosts: () => null,
}))
vi.mock("@/components/ui/page-transition", () => ({
  PageTransition: () => null,
}))
vi.mock("@/components/ui/json-ld", () => ({
  JsonLd: () => null,
}))

// A real post that lives in content/blog/. Picked deliberately — it's the
// shortest path through generateMetadata's happy branch (covers fallbacks for
// updatedDate and ogImage).
const KNOWN_SLUG = "how-to-write-a-winning-scholarship-essay"

describe("blog detail generateMetadata", () => {
  it("returns a populated Metadata object for a known post", async () => {
    const { generateMetadata } = await import("../blog/[slug]/page")
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: KNOWN_SLUG }),
    })

    expect(meta.title).toBeTruthy()
    expect(typeof meta.description).toBe("string")
    expect(meta.description?.length).toBeGreaterThan(0)
  })

  it("sets canonical URL to /blog/<slug>", async () => {
    const { generateMetadata } = await import("../blog/[slug]/page")
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: KNOWN_SLUG }),
    })

    expect(meta.alternates?.canonical).toBe(`/blog/${KNOWN_SLUG}`)
  })

  it("emits openGraph as type 'article' with publishedTime + modifiedTime", async () => {
    const { generateMetadata } = await import("../blog/[slug]/page")
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: KNOWN_SLUG }),
    })

    const og = meta.openGraph as Record<string, unknown> | undefined
    expect(og).toBeDefined()
    expect(og?.type).toBe("article")
    expect(typeof og?.publishedTime).toBe("string")
    expect((og?.publishedTime as string).length).toBeGreaterThan(0)
    expect(typeof og?.modifiedTime).toBe("string")
    expect(og?.url).toBe(`/blog/${KNOWN_SLUG}`)
  })

  it("openGraph image has absolute URL, 1200x630, and a non-empty alt", async () => {
    const { generateMetadata } = await import("../blog/[slug]/page")
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: KNOWN_SLUG }),
    })

    const og = meta.openGraph as { images?: Array<Record<string, unknown>> }
    const image = og.images?.[0]
    expect(image).toBeDefined()
    expect(image?.width).toBe(1200)
    expect(image?.height).toBe(630)
    expect(typeof image?.alt).toBe("string")
    expect((image?.alt as string).length).toBeGreaterThan(0)
    expect(image?.url).toMatch(/^https?:\/\//)
    expect(image?.url).toEqual(expect.stringContaining(SITE_URL))
  })

  it("emits an article author list pulled from post.author.name", async () => {
    const { generateMetadata } = await import("../blog/[slug]/page")
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: KNOWN_SLUG }),
    })

    const og = meta.openGraph as { authors?: string[] }
    expect(og.authors).toBeInstanceOf(Array)
    expect(og.authors?.length).toBeGreaterThan(0)
    expect(typeof og.authors?.[0]).toBe("string")
  })

  it("emits twitter summary_large_image with title, description, image", async () => {
    const { generateMetadata } = await import("../blog/[slug]/page")
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: KNOWN_SLUG }),
    })

    const tw = meta.twitter as Record<string, unknown> | undefined
    expect(tw).toBeDefined()
    expect(tw?.card).toBe("summary_large_image")
    expect(typeof tw?.title).toBe("string")
    expect(typeof tw?.description).toBe("string")
    expect(tw?.images).toBeInstanceOf(Array)
  })

  it("falls back to a 'Post Not Found' title for an unknown slug", async () => {
    const { generateMetadata } = await import("../blog/[slug]/page")
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "this-slug-definitely-does-not-exist" }),
    })

    // `title.absolute` bypasses the parent template.
    const title = meta.title as { absolute?: string }
    expect(title.absolute).toContain("Post Not Found")
  })
})
