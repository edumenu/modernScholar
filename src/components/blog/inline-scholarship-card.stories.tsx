import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { InlineScholarshipCard } from "./inline-scholarship-card"

// Slug taken from the first entry of src/data/scholarships-enriched.json so
// the lookup always resolves in Storybook without modifying the dataset.
const FIRST_SCHOLARSHIP_SLUG = "engebretson-foundation-scholarship-march-1"

const meta: Meta<typeof InlineScholarshipCard> = {
  title: "Blog/InlineScholarshipCard",
  component: InlineScholarshipCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl bg-background px-6 py-10">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof InlineScholarshipCard>

export const Default: Story = {
  args: {
    slug: FIRST_SCHOLARSHIP_SLUG,
  },
}

export const InsideBlogProse: Story = {
  render: (args) => (
    <article className="prose prose-neutral max-w-none">
      <p className="mt-4 text-base leading-relaxed text-on-surface">
        Editorial paragraphs flow naturally above the inline scholarship card.
        The card breaks out of the prose rhythm with its own surface treatment
        while remaining anchored to the reading column.
      </p>
      <InlineScholarshipCard {...args} />
      <p className="mt-4 text-base leading-relaxed text-on-surface">
        After the card, the blog continues — the bottom margin should leave
        the next paragraph comfortably spaced.
      </p>
    </article>
  ),
  args: {
    slug: FIRST_SCHOLARSHIP_SLUG,
  },
}
