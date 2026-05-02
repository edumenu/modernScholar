export const ELIGIBILITY_FLAT_TAGS = [
  "Need-Based",
  "Merit-Based",
  "First-Generation",
  "State-Specific",
  "Athletic",
  "Creative/Arts",
] as const

export type EligibilityFlatTag = (typeof ELIGIBILITY_FLAT_TAGS)[number]

export const ELIGIBILITY_CATEGORIES = {
  "Gender-Specific": ["Women", "Men"],
  "Race/Ethnicity": ["African American/Black", "Hispanic/Latino", "Jewish"],
  "Disability/Health": [
    "Vision",
    "Hearing",
    "Learning Disability",
    "Cancer/Chronic Illness",
    "Mental Health",
  ],
  "Major-Specific": [
    "STEM/Engineering",
    "Business/Accounting",
    "Healthcare/Nursing",
    "Arts/Theater",
    "Agriculture",
    "Law",
    "Architecture",
  ],
  "Military/Veterans": ["Active Duty", "Veteran", "Military Dependent"],
} as const

export type EligibilityCategory = keyof typeof ELIGIBILITY_CATEGORIES

export type Tag =
  | EligibilityFlatTag
  | "Gender-Specific:Women"
  | "Gender-Specific:Men"
  | "Race/Ethnicity:African American/Black"
  | "Race/Ethnicity:Hispanic/Latino"
  | "Race/Ethnicity:Jewish"
  | "Disability/Health:Vision"
  | "Disability/Health:Hearing"
  | "Disability/Health:Learning Disability"
  | "Disability/Health:Cancer/Chronic Illness"
  | "Disability/Health:Mental Health"
  | "Major-Specific:STEM/Engineering"
  | "Major-Specific:Business/Accounting"
  | "Major-Specific:Healthcare/Nursing"
  | "Major-Specific:Arts/Theater"
  | "Major-Specific:Agriculture"
  | "Major-Specific:Law"
  | "Major-Specific:Architecture"
  | "Military/Veterans:Active Duty"
  | "Military/Veterans:Veteran"
  | "Military/Veterans:Military Dependent"

export type TagGroup = { category: string; tags: readonly Tag[] }

export const ALL_TAGS: readonly Tag[] = [
  ...ELIGIBILITY_FLAT_TAGS,
  ...(Object.entries(ELIGIBILITY_CATEGORIES).flatMap(([category, subOptions]) =>
    subOptions.map((sub) => `${category}:${sub}` as Tag),
  )),
]

export const TAG_GROUPS: readonly TagGroup[] = [
  { category: "flat", tags: ELIGIBILITY_FLAT_TAGS },
  ...(Object.entries(ELIGIBILITY_CATEGORIES).map(([category, subOptions]) => ({
    category,
    tags: subOptions.map((sub) => `${category}:${sub}` as Tag),
  }))),
]

export function isEligibilityFlatTag(tag: string): tag is EligibilityFlatTag {
  return (ELIGIBILITY_FLAT_TAGS as readonly string[]).includes(tag)
}

export function getEligibilityCategory(tag: string): EligibilityCategory | null {
  const idx = tag.indexOf(":")
  if (idx === -1) return null
  const head = tag.slice(0, idx)
  return head in ELIGIBILITY_CATEGORIES ? (head as EligibilityCategory) : null
}

export function getEligibilitySubOption(tag: string): string | null {
  const idx = tag.indexOf(":")
  return idx === -1 ? null : tag.slice(idx + 1)
}

export function getEligibilityTagLabel(tag: string): string {
  return getEligibilitySubOption(tag) ?? tag
}

// TAG_RULES: declaration order is output order; results are deduplicated.
const TAG_RULES: ReadonlyArray<readonly [Tag, RegExp]> = [
  ["Need-Based", /financial need|low[- ]income|government assistance|demonstrated need|need[- ]based|pell eligible/i],
  ["Merit-Based", /\bGPA\b|grade point|academic achievement|academic excellence|cumulative.*\d+\.\d+|minimum.*\d+\.\d+.*GPA|\d+\.\d+.*GPA/i],
  ["First-Generation", /first[- ]generation/i],
  ["State-Specific", /\b(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|Bay Area|Broward|District of Columbia)\b/i],
  ["Athletic", /\bNCAA\b|sport of golf|\bathletic\b|\bathletics\b|\bsport\b|\bathlete\b/i],
  ["Creative/Arts", /science fiction|fantasy (artists|writers)|poets?\b|creative writing|\btheater\b|\btheatre\b|performing arts/i],

  ["Gender-Specific:Women", /\bfemale\b|\bwomen\b|\bwoman\b/i],
  ["Gender-Specific:Men", /\bmale students\b|\bmale\b(?!.*female)/i],

  ["Race/Ethnicity:African American/Black", /african american|\bblack\b/i],
  ["Race/Ethnicity:Hispanic/Latino", /hispanic|latino|latina/i],
  ["Race/Ethnicity:Jewish", /\bjewish\b/i],

  ["Disability/Health:Vision", /legally blind|\bblind\b.*eyes|vision impair/i],
  ["Disability/Health:Hearing", /hearing loss|\bdeaf\b|hearing impair/i],
  ["Disability/Health:Learning Disability", /learning disabilit|\bLD\b/i],
  ["Disability/Health:Cancer/Chronic Illness", /\bcancer\b|chronic disease|chronic illness/i],
  ["Disability/Health:Mental Health", /mental health/i],

  ["Major-Specific:STEM/Engineering", /\bengineering\b|\bSTEM\b|technical.*major/i],
  ["Major-Specific:Business/Accounting", /\bbusiness\b|\baccounting\b|management/i],
  ["Major-Specific:Healthcare/Nursing", /\bnursing\b|\bhealthcare\b|health care|speech language pathology|\bMHA\b|medical/i],
  ["Major-Specific:Arts/Theater", /\btheater\b|\btheatre\b|performing arts|costume|interior design/i],
  ["Major-Specific:Agriculture", /\bagriculture\b|food[- ]related/i],
  ["Major-Specific:Law", /\blaw student\b|\blaw school\b/i],
  ["Major-Specific:Architecture", /\barchitecture\b|\bNAAB\b/i],

  ["Military/Veterans:Active Duty", /active duty|armed forces/i],
  ["Military/Veterans:Veteran", /\bveteran\b/i],
  ["Military/Veterans:Military Dependent", /military.*dependent|dependent.*military|\bNavy League\b|military affiliated/i],
]

export function classify(eligibilityText: string): Tag[] {
  if (!eligibilityText) return []
  const seen = new Set<Tag>()
  const out: Tag[] = []
  for (const [tag, pattern] of TAG_RULES) {
    if (pattern.test(eligibilityText) && !seen.has(tag)) {
      seen.add(tag)
      out.push(tag)
    }
  }
  return out
}

export function matches(
  scholarship: { eligibilityTags: readonly Tag[] },
  selected: readonly Tag[],
): boolean {
  if (selected.length === 0) return true

  const tags = scholarship.eligibilityTags
  const groups = new Map<string, Tag[]>()
  for (const tag of selected) {
    const key = getEligibilityCategory(tag) ?? tag
    const bucket = groups.get(key)
    if (bucket) bucket.push(tag)
    else groups.set(key, [tag])
  }

  for (const [, groupTags] of groups) {
    const hasMatch = groupTags.some((t) => tags.includes(t))
    if (!hasMatch) return false
  }

  return true
}
