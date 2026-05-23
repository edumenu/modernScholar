import type { Metadata } from "next";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blog-grid";
import { getAllPosts } from "@/lib/blog";
import { PageTransition } from "@/components/ui/page-transition";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Expert advice, success stories, and practical tips to help you navigate your scholarship journey and achieve your educational goals.",
  openGraph: {
    title: "Blog",
    description:
      "Expert advice, success stories, and practical tips to help you navigate your scholarship journey and achieve your educational goals.",
    type: "website",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <PageTransition>
      <div className="page-padding-y flex flex-col gap-16 h-auto">
        <BlogHero />
        <BlogGrid posts={posts} />
      </div>
    </PageTransition>
  );
}
