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
      <div className="flex h-120 w-80 bg-background p-4">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ScholarshipCard>

export const Undergraduate: Story = {
  args: {
    scholarship: baseScholarship,
  },
}

export const HighSchool: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "highschool-demo",
      name: "National Merit Scholarship",
      classification: ["High School"],
    },
  },
}

export const Graduate: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "graduate-demo",
      name: "Fulbright Research Fellowship",
      classification: ["Graduate"],
    },
  },
}

export const K8: Story = {
  name: "K-8",
  args: {
    scholarship: {
      ...baseScholarship,
      id: "k8-demo",
      name: "Young Scholars Program",
      classification: ["K-8"],
    },
  },
}

export const K12: Story = {
  name: "K-12",
  args: {
    scholarship: {
      ...baseScholarship,
      id: "k12-demo",
      name: "All Ages Learning Award",
      classification: ["K-12"],
    },
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
      id: "long-title",
      name: "The Extraordinary Educational Achievement Award for Underrepresented Students in STEM and the Humanities",
    },
  },
}

export const NoDescription: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "no-desc",
      name: "Simple Award",
      description: "",
    },
  },
}
