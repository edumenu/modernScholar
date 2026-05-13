"use client"

import { useState } from "react"
import Image from "next/image"

interface BlogDetailHeroImageProps {
  src: string
  alt: string
}

export function BlogDetailHeroImage({ src, alt }: BlogDetailHeroImageProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <>
      <Image
        src={imgError ? "/mountain.png" : src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 66vw"
        priority
        onError={() => setImgError(true)}
      />
      {/* Soft primary tint — lighter pass in dark mode where the page chrome
          already provides plenty of contrast and a heavy multiply just
          flattens the photo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply bg-primary/30 dark:bg-primary/15"
      />
      {/* Subtle bottom anchor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-primary-900/35 dark:to-primary-900/15"
      />
    </>
  );
}
