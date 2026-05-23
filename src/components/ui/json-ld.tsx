import type { JsonLdGraph } from "@/lib/structured-data"

interface JsonLdProps {
  data: JsonLdGraph
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
