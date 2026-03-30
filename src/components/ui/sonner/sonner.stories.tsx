import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toaster } from "./sonner";
import { Button } from "../button/button";
import { toast } from "sonner";

const meta: Meta<typeof Toaster> = {
  title: "UI/Toast",
  component: Toaster,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => toast("Default notification")}
      >
        Default Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Resource saved successfully")}
      >
        Success Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Failed to save resource")}
      >
        Error Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("New resources available")}
      >
        Info Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Unsaved changes detected")}
      >
        Warning Toast
      </Button>
    </div>
  ),
};
