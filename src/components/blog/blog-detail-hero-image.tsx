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
    <Image
      src={imgError ? "/mountain.png" : src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 66vw"
      priority
      onError={() => setImgError(true)}
    />
  )
}
