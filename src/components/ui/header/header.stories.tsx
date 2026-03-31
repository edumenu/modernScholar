import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ThemeProvider } from "next-themes"
import { Header } from "./header"

const meta: Meta<typeof Header> = {
  title: "UI/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <div className="relative min-h-[200px] bg-background">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {}

export const ScholarshipsActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/scholarships" } },
  },
}

export const BlogActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/blog" } },
  },
}

export const ContactActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/contact" } },
  },
}

export const AboutActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/about" } },
  },
}

export const OverContent: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/scholarships" } },
  },
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="relative min-h-[600px] bg-gradient-to-b from-primary-100 to-background">
        <Header />
        <div className="flex flex-col items-center justify-center gap-4 pt-24 text-center">
          <h1 className="font-heading text-4xl font-bold text-on-surface">
            Page Content Below Nav
          </h1>
          <p className="max-w-md text-on-surface-variant">
            The navigation floats above content with a glassmorphic backdrop
            blur effect.
          </p>
        </div>
      </div>
    </ThemeProvider>
  ),
}
