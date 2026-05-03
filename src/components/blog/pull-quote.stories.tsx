import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PullQuote } from "./pull-quote"

const meta: Meta<typeof PullQuote> = {
  title: "Blog/PullQuote",
  component: PullQuote,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl bg-background px-6 py-12">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof PullQuote>

export const Default: Story = {
  args: {
    quote:
      "The scholarship is not just an award; it is a covenant between the curious mind and the institutions that believe in its potential.",
    attribution: "Dr. Eleanor Whitcombe, Dean of Academic Affairs",
  },
}

export const QuoteOnly: Story = {
  args: {
    quote:
      "Curation is the new authorship — the art of choosing well in an age of abundance.",
  },
}

export const ShortQuote: Story = {
  args: {
    quote: "Read deeply. Apply boldly.",
    attribution: "Modern Scholar Editorial",
  },
}
