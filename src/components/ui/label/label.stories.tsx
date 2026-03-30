import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: "Form Label" },
};

export const WithAnnotation: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Label>Standard Label</Label>
      <Label className="text-xs">Small Annotation Label</Label>
      <Label className="font-semibold">Semibold Label</Label>
    </div>
  ),
};
