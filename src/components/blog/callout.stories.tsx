import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Callout } from "./callout"

const meta: Meta<typeof Callout> = {
  title: "Blog/Callout",
  component: Callout,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["tip", "warning", "note"],
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl bg-background px-6 py-10">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Callout>

export const Tip: Story = {
  args: {
    type: "tip",
    children: (
      <p>
        Most successful applicants begin drafting their personal statement
        <strong> at least four weeks </strong>
        before the deadline. Give yourself room to revise.
      </p>
    ),
  },
}

export const Warning: Story = {
  args: {
    type: "warning",
    children: (
      <p>
        Submitting after the published deadline almost always disqualifies your
        application — even when the portal still appears open. Always confirm
        the timezone of the awarding institution.
      </p>
    ),
  },
}

export const Note: Story = {
  args: {
    type: "note",
    children: (
      <p>
        Some scholarships allow letters of recommendation to be sent
        independently after the application is filed. Check the FAQ before
        chasing your recommenders.
      </p>
    ),
  },
}

export const WithLinkAndList: Story = {
  args: {
    type: "tip",
    children: (
      <>
        <p>Before submitting, double-check that you have:</p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>A polished personal statement</li>
          <li>Two letters of recommendation</li>
          <li>An official or unofficial transcript</li>
        </ul>
        <p>
          Need help structuring your essay? Read our{" "}
          <a href="#">guide to scholarship narratives</a>.
        </p>
      </>
    ),
  },
}
