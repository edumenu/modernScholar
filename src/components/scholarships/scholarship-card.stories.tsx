import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ScholarshipCard } from "./scholarship-card"
import type { Scholarship } from "@/data/scholarships"

const baseScholarship: Scholarship = {
  id: "demo",
  title: "Tech Excellence Scholarship",
  provider: "Tech Foundation",
  amount: "$10,000",
  deadline: "April 30, 2026",
  rating: 4.8,
  image: "/scholarships/scholarship-1.jpg",
  tag: "Featured",
  category: "Technology",
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

export const WithoutTag: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "no-tag",
      tag: undefined,
    },
  },
}

export const Dimmed: Story = {
  args: {
    scholarship: baseScholarship,
    dimmed: true,
  },
}

export const PopularTag: Story = {
  args: {
    scholarship: {
      ...baseScholarship,
      id: "popular",
      title: "First Generation Scholar",
      tag: "Popular",
      category: "General",
    },
  },
}
