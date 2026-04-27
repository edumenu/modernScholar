import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ScholarshipCard } from "./scholarship-card"
import type { Scholarship } from "@/data/scholarships"

const baseScholarship: Scholarship = {
  id: "demo-scholarship-march-1",
  name: "Tech Excellence Scholarship",
  provider: "Tech Foundation",
  awardAmount: "$10,000",
  deadline: "March 1",
  deadlineYear: 2027,
  classification: ["Undergraduate"],
  link: "https://example.com/apply",
  openDate: null,
  eligibility: "Must be enrolled in an accredited university.",
  season: "spring",
  image: "/scholarships/scholarship-1.jpg",
  description: "Awarded to students demonstrating exceptional skill in technology.",
}

const meta: Meta<typeof ScholarshipCard> = {
  title: "Scholarships/ScholarshipCard",
  component: ScholarshipCard,
  tags: ["autodocs"],
  args: {
    onExpand: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex h-100 w-81.25 bg-background p-4">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ScholarshipCard>

export const Default: Story = {
  args: {
    scholarship: baseScholarship,
  },
}

export const GradientFallback: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "gradient-demo",
      image: "gradient",
    },
  },
}

export const Dimmed: Story = {
  args: {
    scholarship: baseScholarship,
    dimmed: true,
  },
}

export const MultipleClassifications: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "multi-level",
      name: "General Access Scholarship",
      classification: ["High School", "Undergraduate", "Graduate"],
    },
  },
}
