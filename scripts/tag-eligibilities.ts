import fs from "fs"
import path from "path"

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
  eligibilityTags?: string[]
  [key: string]: unknown
}

// Each rule: [tag string, regex pattern to match against eligibility text]
type TagRule = [tag: string, pattern: RegExp]

const TAG_RULES: TagRule[] = [
  // --- Flat tags ---
  ["Need-Based", /financial need|low[- ]income|government assistance|demonstrated need|need[- ]based|pell eligible/i],
  ["Merit-Based", /\bGPA\b|grade point|academic achievement|academic excellence|cumulative.*\d+\.\d+|minimum.*\d+\.\d+.*GPA|\d+\.\d+.*GPA/i],
  ["First-Generation", /first[- ]generation/i],
  ["State-Specific", /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|Bay Area|Broward|District of Columbia)\b/i],
  ["Athletic", /\bNCAA\b|sport of golf|\bathletic\b|\bathletics\b|\bsport\b|\bathlete\b/i],
  ["Creative/Arts", /science fiction|fantasy (artists|writers)|poets?\b|creative writing|\btheater\b|\btheatre\b|performing arts/i],

  // --- Gender-Specific ---
  ["Gender-Specific:Women", /\bfemale\b|\bwomen\b|\bwoman\b/i],
  ["Gender-Specific:Men", /\bmale students\b|\bmale\b(?!.*female)/i],

  // --- Race/Ethnicity ---
  ["Race/Ethnicity:African American/Black", /african american|\bblack\b/i],
  ["Race/Ethnicity:Hispanic/Latino", /hispanic|latino|latina/i],
  ["Race/Ethnicity:Jewish", /\bjewish\b/i],

  // --- Disability/Health ---
  ["Disability/Health:Vision", /legally blind|\bblind\b.*eyes|vision impair/i],
  ["Disability/Health:Hearing", /hearing loss|\bdeaf\b|hearing impair/i],
  ["Disability/Health:Learning Disability", /learning disabilit|\bLD\b/i],
  ["Disability/Health:Cancer/Chronic Illness", /\bcancer\b|chronic disease|chronic illness/i],
  ["Disability/Health:Mental Health", /mental health/i],

  // --- Major-Specific ---
  ["Major-Specific:STEM/Engineering", /\bengineering\b|\bSTEM\b|technical.*major/i],
  ["Major-Specific:Business/Accounting", /\bbusiness\b|\baccounting\b|management/i],
  ["Major-Specific:Healthcare/Nursing", /\bnursing\b|\bhealthcare\b|health care|speech language pathology|\bMHA\b|medical/i],
  ["Major-Specific:Arts/Theater", /\btheater\b|\btheatre\b|performing arts|costume|interior design/i],
  ["Major-Specific:Agriculture", /\bagriculture\b|food[- ]related/i],
  ["Major-Specific:Law", /\blaw student\b|\blaw school\b/i],
  ["Major-Specific:Architecture", /\barchitecture\b|\bNAAB\b/i],

  // --- Military/Veterans ---
  ["Military/Veterans:Active Duty", /active duty|armed forces/i],
  ["Military/Veterans:Veteran", /\bveteran\b/i],
  ["Military/Veterans:Military Dependent", /military.*dependent|dependent.*military|\bNavy League\b|military affiliated/i],
]

function tagScholarship(scholarship: Scholarship): string[] {
  const text = scholarship.eligibility || ""
  const tags: string[] = []

  for (const [tag, pattern] of TAG_RULES) {
    if (pattern.test(text)) {
      tags.push(tag)
    }
  }

  // Deduplicate (in case multiple patterns match for same tag)
  return [...new Set(tags)]
}

function main() {
  const jsonPath = path.resolve(__dirname, "../src/data/scholarships-enriched.json")
  const raw = fs.readFileSync(jsonPath, "utf-8")
  const scholarships: Scholarship[] = JSON.parse(raw)

  let taggedCount = 0
  let totalTags = 0

  for (const scholarship of scholarships) {
    const tags = tagScholarship(scholarship)
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

  // Print tag distribution
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

  // Print untagged scholarships for manual review
  const untagged = scholarships.filter((s) => s.eligibilityTags!.length === 0)
  if (untagged.length > 0) {
    console.log(`\nUntagged scholarships (${untagged.length}):`)
    for (const s of untagged) {
      console.log(`  - ${s.id}: "${s.eligibility.slice(0, 80)}..."`)
    }
  }
}

main()
