import fs from "fs"
import path from "path"
import { classify, type Tag } from "@/lib/eligibility"

/**
 * One-time script to add structured eligibilityTags to each scholarship
 * based on keyword matching against the eligibility field.
 *
 * Format: flat tags = "Need-Based", category sub-options = "Race/Ethnicity:African American/Black"
 *
 * Run: npx tsx scripts/tag-eligibilities.ts
 */

interface Scholarship {
  id: string
  eligibility: string
  eligibilityTags?: Tag[]
  [key: string]: unknown
}

function main() {
  const jsonPath = path.resolve(__dirname, "../src/data/scholarships-enriched.json")
  const raw = fs.readFileSync(jsonPath, "utf-8")
  const scholarships: Scholarship[] = JSON.parse(raw)

  let taggedCount = 0
  let totalTags = 0

  for (const scholarship of scholarships) {
    const tags = classify(scholarship.eligibility ?? "")
    scholarship.eligibilityTags = tags
    if (tags.length > 0) {
      taggedCount++
      totalTags += tags.length
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(scholarships, null, 2) + "\n", "utf-8")

  console.log(`Tagged ${taggedCount}/${scholarships.length} scholarships`)
  console.log(`Total tags assigned: ${totalTags}`)
  console.log(`Average tags per tagged scholarship: ${(totalTags / taggedCount).toFixed(1)}`)

  const distribution: Record<string, number> = {}
  for (const s of scholarships) {
    for (const tag of s.eligibilityTags!) {
      distribution[tag] = (distribution[tag] || 0) + 1
    }
  }

  console.log("\nTag distribution:")
  for (const [tag, count] of Object.entries(distribution).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tag}: ${count}`)
  }

  const untagged = scholarships.filter((s) => s.eligibilityTags!.length === 0)
  if (untagged.length > 0) {
    console.log(`\nUntagged scholarships (${untagged.length}):`)
    for (const s of untagged) {
      console.log(`  - ${s.id}: "${s.eligibility.slice(0, 80)}..."`)
    }
  }
}

main()
