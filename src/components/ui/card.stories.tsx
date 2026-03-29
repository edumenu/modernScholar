import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Academic Resource</CardTitle>
        <CardDescription>
          A curated collection of scholarly materials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with tonal surface layering — no borders needed.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">View Details</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-[320px]">
      <CardHeader>
        <CardTitle>Compact Card</CardTitle>
        <CardDescription>Smaller padding variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Compact content area.</p>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>With Action</CardTitle>
        <CardDescription>Card with an action button.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Content with action in the header.</p>
      </CardContent>
    </Card>
  ),
};

export const Nested: Story = {
  render: () => (
    <div className="rounded-lg bg-surface-container-high p-6">
      <Card className="w-[380px] bg-surface-container-lowest">
        <CardHeader>
          <CardTitle>Nested Card</CardTitle>
          <CardDescription>
            Surface-container-lowest inside surface-container-high creates
            natural definition without borders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This demonstrates the tonal nesting pattern.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
