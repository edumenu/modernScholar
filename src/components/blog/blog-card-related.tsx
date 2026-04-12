"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import type { BlogPost } from "@/data/blog-posts";
import { glassPill } from "@/components/ui/styles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCardRelated({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <motion.div
        whileHover={{ scale: 1.009 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden cursor-pointer rounded-2xl border border-white/40 bg-white/25 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300",
          "dark:border-white/10 dark:bg-white/10",
        )}
      >
        {/* Category badge */}
        <div
          className={cn(
            glassPill,
            "inline-flex w-fit items-center gap-2 px-3.5 py-0.5 text-xs tracking-wider",
          )}
        >
          <span className="size-1.5 rounded-full bg-on-surface" />
          <span className="text-on-surface">{post.category}</span>
        </div>

        {/* Illustration */}
        <div className="relative mx-auto mt-4 size-60">
          <Image
            src="/mountain.png"
            alt={post.title}
            fill
            className="object-cover"
            sizes="240px"
          />
        </div>

        {/* Title */}
        <h2 className="mt-4 font-heading text-xl font-medium leading-snug text-on-surface md:text-2xl">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant line-clamp-2">
          {post.excerpt}
        </p>

        {/* Metadata row */}
        {/* <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-on-surface-variant">Published</span>
            <span className="font-medium text-on-surface">
              {post.publishDate}
            </span>
          </div>
        </div> */}

        {/* Footer: read time + arrow */}
        <div className="flex items-center justify-between">
          {/* <span className="text-xs font-medium text-on-surface">
            {post.readTime}
          </span> */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            animateText
            variant="secondary"
            data-icon="inline-start"
            size="xs"
            hoverTrigger="parent"
          >
            <span data-label>View</span>
            <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}
