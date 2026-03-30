import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./sheet";
import { Button } from "../button/button";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Sheet>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open Sheet (Right)
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Resource Details</SheetTitle>
          <SheetDescription>
            View and edit the details of this academic resource.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 p-6">
          <p className="text-sm text-on-surface-variant">
            Sheet body uses solid surface — no glass on persistent elements.
          </p>
        </div>
        <SheetFooter>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open Sheet (Left)
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse your library.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 p-6">
          <p className="text-sm">Left-side navigation panel.</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open Sheet (Bottom)
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>Select an action below.</SheetDescription>
        </SheetHeader>
        <div className="p-6">
          <div className="flex gap-2">
            <Button size="sm">Add Note</Button>
            <Button size="sm" variant="secondary">
              Share
            </Button>
            <Button size="sm" variant="ghost">
              Archive
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
