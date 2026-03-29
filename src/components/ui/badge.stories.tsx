import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Philosophy" },
};

export const Secondary: Story = {
  args: { children: "In Progress", variant: "secondary" },
};

export const Destructive: Story = {
  args: { children: "Overdue", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Draft", variant: "outline" },
};

export const CuratorsTray: Story = {
  name: "Curator's Tray Pattern",
  render: () => (
    <div className="flex flex-wrap gap-2 rounded-xl bg-surface-container-highest p-4">
      <Badge>Philosophy</Badge>
      <Badge>Literature</Badge>
      <Badge>History</Badge>
      <Badge>Theology</Badge>
      <Badge variant="destructive">Due Soon</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default (Sage)</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};
