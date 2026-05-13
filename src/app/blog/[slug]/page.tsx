import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { BlogDetail } from "@/components/blog/blog-detail"
import { BlogDetailContent } from "@/components/blog/blog-detail-content"
import { RelatedPosts } from "@/components/blog/related-posts"
import { PageTransition } from "@/components/ui/page-transition"
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  type BlogPost,
} from "@/lib/blog"
import { SITE_URL } from "@/lib/constants"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

function toAbsoluteUrl(maybeRelative: string): string {
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative
  return `${SITE_URL}${maybeRelative.startsWith("/") ? "" : "/"}${maybeRelative}`
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found | Modern Scholar",
    }
  }

  const description = post.seoDescription || post.excerpt
  const ogImage = toAbsoluteUrl(post.ogImage || post.image)

  return {
    title: `${post.title} | Modern Scholar`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: [{ url: ogImage }],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const related = await getRelatedPosts(post)

  let seriesPosts: BlogPost[] | undefined
  if (post.series) {
    const seriesName = post.series.name
    const all = await getAllPosts()
    seriesPosts = all
      .filter((p) => p.series?.name === seriesName)
      .sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0))
  }

  // Dynamic import compiles the MDX file through @next/mdx and the
  // top-level mdx-components.tsx map. The variable form works with webpack —
  // it scans content/blog/ at build time and bundles every matching .mdx.
  // dynamicParams = false guards the happy path; the try/catch makes any
  // resolution failure (missing file, build artifact divergence) explicit
  // instead of bubbling as an unhandled server exception.
  let Mdx: React.ComponentType
  try {
    Mdx = (await import(`../../../../content/blog/${slug}.mdx`)).default
  } catch {
    notFound()
  }

  // RelatedPosts now derives its prop shape via Pick<BlogPost, ...>, so we
  // can pass the loader output directly.
  const relatedItems = related

  return (
    <PageTransition>
      <div className="page-padding-y flex gap-20 flex-col">
        <BlogDetail post={post} seriesPosts={seriesPosts}>
          <BlogDetailContent post={post} body={<Mdx />} />
        </BlogDetail>
        <RelatedPosts posts={relatedItems} />
      </div>
    </PageTransition>
  )
}
