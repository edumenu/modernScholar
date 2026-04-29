import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ScholarshipListCardSpread } from "./scholarship-list-card"
import type { Scholarship } from "@/data/scholarships"

const baseScholarship: Scholarship = {
  id: "demo-list-1",
  name: "Tech Excellence Scholarship",
  provider: "Tech Foundation",
  awardAmount: "$10,000",
  deadline: "March 1",
  deadlineYear: 2027,
  classification: ["Undergraduate"],
  link: "https://example.com/apply",
  openDate: null,
  eligibility: "Must be enrolled in an accredited university pursuing a STEM degree.",
  season: "spring",
  description: "Awarded to students demonstrating exceptional skill in technology and innovation.",
}

const allClassifications: Scholarship[] = [
  { ...baseScholarship, id: "list-hs", name: "National Merit Scholarship", classification: ["High School"], provider: "National Merit Corp", awardAmount: "$2,500" },
  { ...baseScholarship, id: "list-ug", name: "Tech Excellence Scholarship", classification: ["Undergraduate"], awardAmount: "$10,000" },
  { ...baseScholarship, id: "list-grad", name: "Fulbright Research Fellowship", classification: ["Graduate"], provider: "Fulbright Commission", awardAmount: "$25,000", deadline: "October 15" },
  { ...baseScholarship, id: "list-k8", name: "Young Scholars Program", classification: ["K-8"], provider: "Education First", awardAmount: "$1,000", deadline: "June 30" },
  { ...baseScholarship, id: "list-k12", name: "All Ages Learning Award", classification: ["K-12"], provider: "Learning Alliance", awardAmount: "$5,000", deadline: "December 1" },
]

const meta: Meta<typeof ScholarshipListCardSpread> = {
  title: "Scholarships/ListCard",
  component: ScholarshipListCardSpread,
  tags: ["autodocs"],
  args: {
    onExpand: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl bg-background">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ScholarshipListCardSpread>

export const Default: Story = {
  args: {
    scholarship: baseScholarship,
  },
}

export const MultipleRows: Story = {
  render: (args) => (
    <div className="flex flex-col rounded-2xl shadow-[0_4px_24px_rgba(32,26,25,0.06)]">
      {allClassifications.map((s) => (
        <ScholarshipListCardSpread key={s.id} scholarship={s} onExpand={args.onExpand} />
      ))}
    </div>
  ),
}

export const Dimmed: Story = {
  args: {
    scholarship: baseScholarship,
    dimmed: true,
  },
}

export const LongTitle: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "list-long",
      name: "The Extraordinary Educational Achievement Award for Underrepresented Students in STEM and the Humanities",
    },
  },
}
