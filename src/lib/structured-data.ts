import { toAbsoluteUrl } from "@/lib/url"
import type { BlogPost } from "@/lib/blog"

// schema.org JSON-LD payload. The builders below return narrowly-typed nodes;
// this alias is the loose contract the <JsonLd> component accepts so it can
// serialize any schema-shaped object without re-declaring every node type.
export type JsonLdGraph = object | object[]

const SCHEMA_CONTEXT = "https://schema.org"
const SITE_NAME = "Modern Scholar"
const LOGO_PATH = "/iconBurgundy.png"

interface OrganizationNode {
  "@type": "Organization"
  "@id": string
  name: string
  url: string
  logo: string
}

interface WebSiteNode {
  "@type": "WebSite"
  "@id": string
  name: string
  url: string
  publisher: { "@id": string }
}

interface SiteGraph {
  "@context": string
  "@graph": [OrganizationNode, WebSiteNode]
}

interface BlogPostingNode {
  "@context": string
  "@type": "BlogPosting"
  headline: string
  description: string
  image: string[]
  datePublished: string
  dateModified: string
  author: {
    "@type": "Person"
    name: string
  }
  publisher: {
    "@type": "Organization"
    name: string
    logo: {
      "@type": "ImageObject"
      url: string
    }
  }
  mainEntityOfPage: {
    "@type": "WebPage"
    "@id": string
  }
}

/**
 * Builds the site-wide JSON-LD graph mounted on the home page: an
 * `Organization` (so Google can attach the brand panel + logo) and a
 * `WebSite` (so Google can attach sitelinks). No `SearchAction` — the
 * scholarship filter UI is not URL-addressable as a `/search?q=` endpoint.
 *
 * Wrapped in a single `@graph` root because naive consumers (Safari built-ins,
 * SEO extensions) call `data["@context"].toLowerCase()` on the parsed payload
 * and crash when the top level is an array instead of an object.
 */
export function siteJsonLd(): SiteGraph {
  const orgId = `${toAbsoluteUrl("/")}#organization`
  const siteId = `${toAbsoluteUrl("/")}#website`

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: toAbsoluteUrl("/"),
        logo: toAbsoluteUrl(LOGO_PATH),
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        name: SITE_NAME,
        url: toAbsoluteUrl("/"),
        publisher: { "@id": orgId },
      },
    ],
  }
}

/**
 * Builds a `BlogPosting` graph for the blog detail page. All URLs are
 * resolved to absolute via `toAbsoluteUrl` because schema.org consumers
 * (Google rich-results test, LinkedIn) reject relative URLs.
 */
export function blogPostJsonLd(post: BlogPost): BlogPostingNode {
  const description = post.seoDescription || post.excerpt
  const image = toAbsoluteUrl(post.ogImage || post.image)
  const pageUrl = toAbsoluteUrl(`/blog/${post.slug}`)

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: [image],
    datePublished: post.publishDate,
    dateModified: post.updatedDate ?? post.publishDate,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl(LOGO_PATH),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  }
}
