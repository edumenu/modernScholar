import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ComparisonSheetAuditLedger } from "./comparison-sheet-audit-ledger"
import type { Scholarship } from "@/data/scholarships"

const scholarshipA: Scholarship = {
  id: "comp-a",
  name: "Tech Excellence Scholarship",
  provider: "Tech Foundation",
  awardAmount: "$10,000",
  deadline: "March 1",
  deadlineYear: 2027,
  classification: ["Undergraduate"],
  link: "https://example.com/apply-a",
  openDate: null,
  eligibility: "Must be enrolled in an accredited university pursuing a STEM degree with a minimum 3.5 GPA.",
  season: "spring",
  description: "Awarded to students demonstrating exceptional skill in technology and innovation across all engineering disciplines.",
}

const scholarshipB: Scholarship = {
  id: "comp-b",
  name: "National Merit Scholarship",
  provider: "National Merit Corp",
  awardAmount: "$2,500",
  deadline: "May 15",
  deadlineYear: 2027,
  classification: ["High School"],
  link: "https://example.com/apply-b",
  openDate: null,
  eligibility: "High school juniors who score in the top 1% on the PSAT/NMSQT.",
  season: "spring",
  description: "Prestigious scholarship recognizing outstanding academic ability among high school students nationwide.",
}

const scholarshipC: Scholarship = {
  id: "comp-c",
  name: "Fulbright Research Fellowship",
  provider: "Fulbright Commission",
  awardAmount: "$25,000",
  deadline: "October 15",
  deadlineYear: 2026,
  classification: ["Graduate"],
  link: "https://example.com/apply-c",
  openDate: null,
  eligibility: "U.S. citizens with a bachelor's degree pursuing graduate study or research abroad.",
  season: "fall",
  description: "Funds international graduate study, advanced research, and teaching assistantships in over 140 countries.",
}

const meta: Meta<typeof ComparisonSheetAuditLedger> = {
  title: "Scholarships/ComparisonAuditLedger",
  component: ComparisonSheetAuditLedger,
  tags: ["autodocs"],
  args: {
    onRemove: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl bg-background p-6">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ComparisonSheetAuditLedger>

export const TwoItems: Story = {
  args: {
    items: [scholarshipA, scholarshipB],
  },
}

export const ThreeItems: Story = {
  args: {
    items: [scholarshipA, scholarshipB, scholarshipC],
  },
}
