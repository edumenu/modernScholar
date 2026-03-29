import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "ghost", "outline", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Primary Button" },
};

export const Secondary: Story = {
  args: { children: "Secondary", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "Tertiary Action", variant: "ghost" },
};

export const Outline: Story = {
  args: { children: "Outline", variant: "outline" },
};

export const Destructive: Story = {
  args: { children: "Delete", variant: "destructive" },
};

export const Link: Story = {
  args: { children: "Link Button", variant: "link" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg" },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
