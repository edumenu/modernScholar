import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm">Section above the separator</p>
      <Separator />
      <p className="text-sm">Section below the separator</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm">Item One</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Item Two</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Item Three</span>
    </div>
  ),
};
