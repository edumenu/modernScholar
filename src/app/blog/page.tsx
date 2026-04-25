import { Suspense } from "react";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogGridSkeleton } from "@/components/blog/blog-grid-skeleton";

export const metadata = {
  title: "Blog | Modern Scholar",
  description:
    "Expert advice, success stories, and practical tips to help you navigate your scholarship journey and achieve your educational goals.",
};

export default function BlogPage() {
  return (
    <div className="page-padding-y flex flex-col gap-16 h-auto">
      <BlogHero />
      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogGrid />
      </Suspense>
    </div>
  );
}
