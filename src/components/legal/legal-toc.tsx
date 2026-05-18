"use client"

import { useEffect, useRef } from "react"
import { useLenis } from "lenis/react"

interface LegalTOCProps {
  sections: ReadonlyArray<{ id: string; title: string }>
}

export function LegalTOC({ sections }: LegalTOCProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const el = detailsRef.current
    if (!el) return
    const handleToggle = () => {
      lenis?.resize()
    }
    el.addEventListener("toggle", handleToggle)
    return () => {
      el.removeEventListener("toggle", handleToggle)
    }
  }, [lenis])

  return (
    <nav aria-label="Page contents">
      <details
        ref={detailsRef}
        className="rounded-lg bg-surface-container-low p-4 md:p-5"
      >
        <summary className="cursor-pointer text-sm font-semibold text-on-surface">
          Contents — tap to expand
        </summary>
        <ul className="mt-2 flex flex-col">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block py-3 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  )
}
