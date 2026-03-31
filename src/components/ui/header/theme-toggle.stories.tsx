import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ThemeProvider } from "next-themes"
import { ThemeToggle } from "./theme-toggle"

const meta: Meta<typeof ThemeToggle> = {
  title: "UI/Header/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="flex items-center justify-center p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    className: { control: "text" },
  },
}
export default meta

type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {}

export const InGlassPill: Story = {
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="flex items-center justify-center p-8">
      <div className="flex h-11.5 items-center justify-center rounded-full border border-white/40 bg-white/25 px-2.5 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-2xl">
        <ThemeToggle />
      </div>
      </div>
    </ThemeProvider>
  ),
}
