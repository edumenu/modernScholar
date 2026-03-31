import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { MobileMenuButton } from "./mobile-menu"

const meta: Meta<typeof MobileMenuButton> = {
  title: "UI/Header/MobileMenu",
  component: MobileMenuButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
    nextjs: { appDirectory: true, navigation: { pathname: "/scholarships" } },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-end p-4">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof MobileMenuButton>

export const Default: Story = {}

export const OnScholarshipsPage: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/scholarships" } },
  },
}

export const OnBlogPage: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/blog" } },
  },
}
