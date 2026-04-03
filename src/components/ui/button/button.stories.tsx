import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconHeart, IconShare, IconBookmark, IconX, IconPlus, IconArrowRight } from "@tabler/icons-react";
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
      options: ["default", "xs", "sm", "lg", "xl", "icon", "icon-xs", "icon-sm", "icon-lg", "icon-xl"],
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

export const ExtraLarge: Story = {
  args: { children: "Extra Large", size: "xl" },
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
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="icon-xs"><IconX /></Button>
      <Button size="icon-sm"><IconHeart /></Button>
      <Button size="icon"><IconPlus /></Button>
      <Button size="icon-lg"><IconShare /></Button>
      <Button size="icon-xl"><IconBookmark /></Button>
    </div>
  ),
};

export const AllIconSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="icon-xs"><IconPlus /></Button>
        <Button size="icon-sm"><IconPlus /></Button>
        <Button size="icon"><IconPlus /></Button>
        <Button size="icon-lg"><IconPlus /></Button>
        <Button size="icon-xl"><IconPlus /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="icon-xs"><IconHeart /></Button>
        <Button variant="secondary" size="icon-sm"><IconHeart /></Button>
        <Button variant="secondary" size="icon"><IconHeart /></Button>
        <Button variant="secondary" size="icon-lg"><IconHeart /></Button>
        <Button variant="secondary" size="icon-xl"><IconHeart /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="icon-xs"><IconShare /></Button>
        <Button variant="outline" size="icon-sm"><IconShare /></Button>
        <Button variant="outline" size="icon"><IconShare /></Button>
        <Button variant="outline" size="icon-lg"><IconShare /></Button>
        <Button variant="outline" size="icon-xl"><IconShare /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon-xs"><IconBookmark /></Button>
        <Button variant="ghost" size="icon-sm"><IconBookmark /></Button>
        <Button variant="ghost" size="icon"><IconBookmark /></Button>
        <Button variant="ghost" size="icon-lg"><IconBookmark /></Button>
        <Button variant="ghost" size="icon-xl"><IconBookmark /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="destructive" size="icon-xs"><IconX /></Button>
        <Button variant="destructive" size="icon-sm"><IconX /></Button>
        <Button variant="destructive" size="icon"><IconX /></Button>
        <Button variant="destructive" size="icon-lg"><IconX /></Button>
        <Button variant="destructive" size="icon-xl"><IconX /></Button>
      </div>
    </div>
  ),
};

export const WithIconStart: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="xs"><IconPlus data-icon="inline-start" /> Create</Button>
        <Button size="sm"><IconPlus data-icon="inline-start" /> Create</Button>
        <Button><IconPlus data-icon="inline-start" /> Create</Button>
        <Button size="lg"><IconPlus data-icon="inline-start" /> Create</Button>
        <Button size="xl"><IconPlus data-icon="inline-start" /> Create</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="xs"><IconHeart data-icon="inline-start" /> Save</Button>
        <Button variant="secondary" size="sm"><IconHeart data-icon="inline-start" /> Save</Button>
        <Button variant="secondary"><IconHeart data-icon="inline-start" /> Save</Button>
        <Button variant="secondary" size="lg"><IconHeart data-icon="inline-start" /> Save</Button>
        <Button variant="secondary" size="xl"><IconHeart data-icon="inline-start" /> Save</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="xs"><IconShare data-icon="inline-start" /> Share</Button>
        <Button variant="outline" size="sm"><IconShare data-icon="inline-start" /> Share</Button>
        <Button variant="outline"><IconShare data-icon="inline-start" /> Share</Button>
        <Button variant="outline" size="lg"><IconShare data-icon="inline-start" /> Share</Button>
        <Button variant="outline" size="xl"><IconShare data-icon="inline-start" /> Share</Button>
      </div>
    </div>
  ),
};

export const WithIconEnd: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="xs">Next <IconArrowRight data-icon="inline-end" /></Button>
        <Button size="sm">Next <IconArrowRight data-icon="inline-end" /></Button>
        <Button>Next <IconArrowRight data-icon="inline-end" /></Button>
        <Button size="lg">Next <IconArrowRight data-icon="inline-end" /></Button>
        <Button size="xl">Next <IconArrowRight data-icon="inline-end" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="xs">Learn More <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="secondary" size="sm">Learn More <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="secondary">Learn More <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="secondary" size="lg">Learn More <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="secondary" size="xl">Learn More <IconArrowRight data-icon="inline-end" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="xs">Explore <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="outline" size="sm">Explore <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="outline">Explore <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="outline" size="lg">Explore <IconArrowRight data-icon="inline-end" /></Button>
        <Button variant="outline" size="xl">Explore <IconArrowRight data-icon="inline-end" /></Button>
      </div>
    </div>
  ),
};
