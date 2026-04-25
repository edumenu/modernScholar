import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { blogPosts } from "@/data/blog-posts"
import { BlogDetail } from "@/components/blog/blog-detail"
import { BlogDetailContent } from "@/components/blog/blog-detail-content"
import { RelatedPosts } from "@/components/blog/related-posts"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: "Post Not Found | Modern Scholar",
    }
  }

  return {
    title: `${post.title} | Modern Scholar`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="page-padding-y flex gap-20 flex-col">
      <BlogDetail post={post}>
        <BlogDetailContent post={post} />
      </BlogDetail>
      <RelatedPosts post={post} />
    </div>
  )
}
