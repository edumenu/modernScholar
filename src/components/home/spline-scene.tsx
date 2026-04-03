"use client"

const SPLINE_URL =
  "https://my.spline.design/3dtextbluecopy-p3VhEDs3s7mx8Hjev2Jg6Y1x/"

export function SplineScene({ className }: { className?: string }) {
  return (
    <iframe
      src={SPLINE_URL}
      className={className}
      title="Interactive 3D model representing academic scholarship"
      allow="autoplay"
      loading="lazy"
      style={{ border: "none" }}
    />
  )
}
