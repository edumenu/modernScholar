import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "./popover";
import { Button } from "../button/button";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gradient-to-br from-surface to-surface-container-high p-10">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Resource Details</PopoverTitle>
            <PopoverDescription>
              Additional information about this academic resource.
            </PopoverDescription>
          </PopoverHeader>
          <div className="text-sm text-on-surface-variant">
            <p>Author: Dr. Jane Smith</p>
            <p>Published: 2025</p>
            <p>Category: Philosophy</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
