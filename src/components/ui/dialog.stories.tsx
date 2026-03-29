import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Dialog> = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <div className="rounded-lg bg-gradient-to-br from-surface to-surface-container-high p-20">
      <Dialog>
        <DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Make changes to your academic resource. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Title</Label>
              <Input id="name" defaultValue="Introduction to Philosophy" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const WithRichBackground: Story = {
  name: "Glass Effect on Rich Background",
  render: () => (
    <div
      className="rounded-lg p-20"
      style={{
        background:
          "linear-gradient(135deg, #76312D 0%, #943E30 50%, #536256 100%)",
      }}
    >
      <Dialog>
        <DialogTrigger render={<Button variant="secondary" />}>
          Open Over Gradient
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Glass Panel Dialog</DialogTitle>
            <DialogDescription>
              This dialog demonstrates the glass-panel effect over a rich
              background. Notice how the frosted glass treatment creates
              spatial depth.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
