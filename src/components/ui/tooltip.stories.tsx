import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";
import { Button } from "./button";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-[120px] items-center justify-center rounded-lg bg-gradient-to-br from-surface to-surface-container-high p-10">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover me
        </TooltipTrigger>
        <TooltipContent>
          <p>Glass-heavy tooltip with warm tint</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center gap-4 rounded-lg bg-gradient-to-br from-surface to-surface-container-high p-10">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>Top</TooltipTrigger>
        <TooltipContent side="top">Top tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>Right</TooltipTrigger>
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>Bottom</TooltipTrigger>
        <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>Left</TooltipTrigger>
        <TooltipContent side="left">Left tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
};
