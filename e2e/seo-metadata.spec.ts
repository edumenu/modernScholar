import { expect, test } from "@playwright/test"

const KNOWN_BLOG_SLUG = "how-to-write-a-winning-scholarship-essay"

// The dev-server-rendered absolute URL prefix. metadataBase in
// src/app/layout.tsx is set from SITE_URL, but at test time the page is served
// from http://localhost:<port>. Next resolves relative OG URLs against
// metadataBase regardless of host, so absolute URLs in the head will point at
// SITE_URL (https://modernscholarhq.com), not localhost.
const PROD_ORIGIN = "https://modernscholarhq.com"

async function readHeadMeta(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const head = document.head
    const getProperty = (selector: string) =>
      head.querySelector(selector)?.getAttribute("content") ?? null
    return {
      ogTitle: getProperty('meta[property="og:title"]'),
      ogImage: getProperty('meta[property="og:image"]'),
      ogType: getProperty('meta[property="og:type"]'),
      ogUrl: getProperty('meta[property="og:url"]'),
      twitterCard: getProperty('meta[name="twitter:card"]'),
      canonical:
        head.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      jsonLdRaw: Array.from(
        head.querySelectorAll<HTMLScriptElement>(
          'script[type="application/ld+json"]',
        ),
      ).map((el) => el.textContent ?? ""),
    }
  })
}

test.describe("SEO metadata — <head> contract", () => {
  test("home / has og:title, og:image (absolute), twitter:card, and JSON-LD site graph", async ({
    page,
  }) => {
    await page.goto("/")
    const head = await readHeadMeta(page)

    expect(head.ogTitle, "og:title must be present and non-empty").toBeTruthy()
    expect(head.ogImage, "og:image must be present").toBeTruthy()
    expect(head.ogImage, "og:image must be an absolute URL under SITE_URL")
      .toMatch(new RegExp(`^${PROD_ORIGIN}/`))
    expect(head.twitterCard).toBe("summary_large_image")

    expect(head.jsonLdRaw.length).toBeGreaterThan(0)
    const graphs = head.jsonLdRaw.map((raw) => JSON.parse(raw))
    const types = graphs
      .flatMap((g) => (Array.isArray(g) ? g : [g]))
      .map((node: { "@type"?: string }) => node["@type"])
    expect(types).toContain("Organization")
    expect(types).toContain("WebSite")
  })

  test("/blog has og:title, og:image, and twitter:card", async ({ page }) => {
    await page.goto("/blog")
    const head = await readHeadMeta(page)

    expect(head.ogTitle).toBeTruthy()
    expect(head.ogImage).toBeTruthy()
    expect(head.ogImage).toMatch(new RegExp(`^${PROD_ORIGIN}/`))
    expect(head.twitterCard).toBe("summary_large_image")
  })

  test(`/blog/${KNOWN_BLOG_SLUG} has article OG, canonical, and BlogPosting JSON-LD`, async ({
    page,
  }) => {
    await page.goto(`/blog/${KNOWN_BLOG_SLUG}`)
    const head = await readHeadMeta(page)

    expect(head.ogTitle).toBeTruthy()
    expect(head.ogImage).toBeTruthy()
    expect(head.ogImage).toMatch(new RegExp(`^${PROD_ORIGIN}/`))
    expect(head.ogType).toBe("article")
    expect(head.ogUrl).toBe(`${PROD_ORIGIN}/blog/${KNOWN_BLOG_SLUG}`)
    expect(head.twitterCard).toBe("summary_large_image")
    expect(head.canonical).toBe(`${PROD_ORIGIN}/blog/${KNOWN_BLOG_SLUG}`)

    expect(head.jsonLdRaw.length).toBeGreaterThan(0)
    const parsed = head.jsonLdRaw.map((raw) => JSON.parse(raw))
    const types = parsed
      .flatMap((g) => (Array.isArray(g) ? g : [g]))
      .map((node: { "@type"?: string }) => node["@type"])
    expect(types).toContain("BlogPosting")

    const blogPosting = parsed
      .flatMap((g) => (Array.isArray(g) ? g : [g]))
      .find(
        (node: { "@type"?: string }) => node["@type"] === "BlogPosting",
      ) as Record<string, unknown> | undefined

    expect(blogPosting).toBeDefined()
    expect(blogPosting?.headline).toBeTruthy()
    expect(blogPosting?.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/)
    expect(blogPosting?.author).toBeTruthy()
    expect(blogPosting?.publisher).toBeTruthy()
  })
})
