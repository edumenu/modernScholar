import { describe, it, expect } from "vitest"
import { SITE_URL } from "../constants"
import { siteJsonLd, blogPostJsonLd } from "../structured-data"
import type { BlogPost } from "../blog"

const samplePost: BlogPost = {
  slug: "how-to-write-a-winning-scholarship-essay",
  title: "How to Write a Winning Scholarship Essay",
  excerpt: "Master the art of scholarship essay writing.",
  category: "Tips & Guides",
  publishDate: "2026-05-10",
  updatedDate: "2026-05-12",
  tags: ["essays"],
  series: undefined,
  featured: true,
  status: "published",
  seoDescription: "A guide to winning scholarship essays.",
  ogImage: "/blog/bookShelf.png",
  coverCredit: undefined,
  relatedScholarships: [],
  image: "/blog/bookShelf.png",
  author: {
    name: "Cathy Dumenu",
    role: "Scholarship Advisor",
    avatar: "/cathy.jpg",
  },
  readTime: "3 min read",
  headings: [],
}

describe("siteJsonLd", () => {
  const graph = siteJsonLd()

  it("returns exactly two nodes (Organization + WebSite)", () => {
    expect(graph).toHaveLength(2)
  })

  it("first node is an Organization with absolute url and logo", () => {
    const org = graph[0]
    expect(org["@type"]).toBe("Organization")
    expect(org["@context"]).toBe("https://schema.org")
    expect(org.name).toBe("Modern Scholar")
    expect(org.url).toBe(`${SITE_URL}/`)
    expect(org.logo).toMatch(/^https?:\/\//)
    expect(org.logo).toContain(SITE_URL)
  })

  it("second node is a WebSite that references the Organization @id", () => {
    const org = graph[0]
    const site = graph[1]
    expect(site["@type"]).toBe("WebSite")
    expect(site.name).toBe("Modern Scholar")
    expect(site.url).toBe(`${SITE_URL}/`)
    expect(site.publisher).toEqual({ "@id": org["@id"] })
  })

  it("never emits SearchAction (deferred per PRD — no real /search endpoint)", () => {
    expect(JSON.stringify(graph)).not.toContain("SearchAction")
    expect(JSON.stringify(graph)).not.toContain("potentialAction")
  })
})

describe("blogPostJsonLd", () => {
  const graph = blogPostJsonLd(samplePost)

  it("is a BlogPosting with all required schema.org fields", () => {
    expect(graph["@context"]).toBe("https://schema.org")
    expect(graph["@type"]).toBe("BlogPosting")
    expect(graph.headline).toBe(samplePost.title)
    expect(graph.description).toBe(samplePost.seoDescription)
    expect(graph.datePublished).toBe("2026-05-10")
    expect(graph.dateModified).toBe("2026-05-12")
  })

  it("falls back to excerpt when seoDescription is empty", () => {
    const noSeo = { ...samplePost, seoDescription: "" }
    const g = blogPostJsonLd(noSeo)
    expect(g.description).toBe(samplePost.excerpt)
  })

  it("falls back to publishDate when updatedDate is missing", () => {
    const noUpdate = { ...samplePost, updatedDate: undefined }
    const g = blogPostJsonLd(noUpdate)
    expect(g.dateModified).toBe(samplePost.publishDate)
  })

  it("resolves image to an absolute URL", () => {
    expect(graph.image).toHaveLength(1)
    expect(graph.image[0]).toMatch(/^https?:\/\//)
    expect(graph.image[0]).toContain(SITE_URL)
    expect(graph.image[0]).toContain("bookShelf.png")
  })

  it("falls back to cover image when ogImage missing", () => {
    const noOg = { ...samplePost, ogImage: undefined }
    const g = blogPostJsonLd(noOg)
    expect(g.image[0]).toContain(samplePost.image.replace(/^\//, ""))
  })

  it("emits a Person author with the post author's name", () => {
    expect(graph.author).toEqual({
      "@type": "Person",
      name: "Cathy Dumenu",
    })
  })

  it("emits an Organization publisher with absolute logo URL", () => {
    expect(graph.publisher["@type"]).toBe("Organization")
    expect(graph.publisher.name).toBe("Modern Scholar")
    expect(graph.publisher.logo["@type"]).toBe("ImageObject")
    expect(graph.publisher.logo.url).toMatch(/^https?:\/\//)
  })

  it("mainEntityOfPage is the absolute blog detail URL", () => {
    expect(graph.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${samplePost.slug}`,
    })
  })

  it("datePublished and dateModified are ISO date strings", () => {
    expect(graph.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/)
    expect(graph.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}/)
  })
})
