import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CTAButton } from "./cta-button"

const meta: Meta<typeof CTAButton> = {
  title: "UI/CTAButton",
  component: CTAButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
}
export default meta

type Story = StoryObj<typeof CTAButton>

export const Primary: Story = {
  args: { label: "Get Started", variant: "primary" },
}

export const Secondary: Story = {
  args: { label: "Learn More", variant: "secondary" },
}

export const Tertiary: Story = {
  args: { label: "Explore", variant: "tertiary" },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <CTAButton label="Get Started" variant="primary" />
      <CTAButton label="Learn More" variant="secondary" />
      <CTAButton label="Explore" variant="tertiary" />
    </div>
  ),
}
