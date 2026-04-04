import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@iconify/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "tertiary", "ghost", "outline", "destructive", "link"],
    },
    animateIcon: { control: "boolean" },
    animateText: { control: "boolean" },
    hoverTrigger: {
      control: "select",
      options: ["self", "parent"],
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

export const Tertiary: Story = {
  args: { children: "Tertiary", variant: "tertiary" },
};

export const Ghost: Story = {
  args: { children: "Ghost Action", variant: "ghost" },
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
      <Button variant="tertiary">Tertiary</Button>
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
      <Button size="icon-xs"><Icon icon="solar:close-circle-line-duotone" /></Button>
      <Button size="icon-sm"><Icon icon="solar:heart-line-duotone" /></Button>
      <Button size="icon"><Icon icon="solar:add-circle-line-duotone" /></Button>
      <Button size="icon-lg"><Icon icon="solar:share-line-duotone" /></Button>
      <Button size="icon-xl"><Icon icon="solar:bookmark-line-duotone" /></Button>
    </div>
  ),
};

export const AllIconSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="icon-xs"><Icon icon="solar:add-circle-line-duotone" /></Button>
        <Button size="icon-sm"><Icon icon="solar:add-circle-line-duotone" /></Button>
        <Button size="icon"><Icon icon="solar:add-circle-line-duotone" /></Button>
        <Button size="icon-lg"><Icon icon="solar:add-circle-line-duotone" /></Button>
        <Button size="icon-xl"><Icon icon="solar:add-circle-line-duotone" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="icon-xs"><Icon icon="solar:heart-line-duotone" /></Button>
        <Button variant="secondary" size="icon-sm"><Icon icon="solar:heart-line-duotone" /></Button>
        <Button variant="secondary" size="icon"><Icon icon="solar:heart-line-duotone" /></Button>
        <Button variant="secondary" size="icon-lg"><Icon icon="solar:heart-line-duotone" /></Button>
        <Button variant="secondary" size="icon-xl"><Icon icon="solar:heart-line-duotone" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="icon-xs"><Icon icon="solar:share-line-duotone" /></Button>
        <Button variant="outline" size="icon-sm"><Icon icon="solar:share-line-duotone" /></Button>
        <Button variant="outline" size="icon"><Icon icon="solar:share-line-duotone" /></Button>
        <Button variant="outline" size="icon-lg"><Icon icon="solar:share-line-duotone" /></Button>
        <Button variant="outline" size="icon-xl"><Icon icon="solar:share-line-duotone" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon-xs"><Icon icon="solar:bookmark-line-duotone" /></Button>
        <Button variant="ghost" size="icon-sm"><Icon icon="solar:bookmark-line-duotone" /></Button>
        <Button variant="ghost" size="icon"><Icon icon="solar:bookmark-line-duotone" /></Button>
        <Button variant="ghost" size="icon-lg"><Icon icon="solar:bookmark-line-duotone" /></Button>
        <Button variant="ghost" size="icon-xl"><Icon icon="solar:bookmark-line-duotone" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="destructive" size="icon-xs"><Icon icon="solar:close-circle-line-duotone" /></Button>
        <Button variant="destructive" size="icon-sm"><Icon icon="solar:close-circle-line-duotone" /></Button>
        <Button variant="destructive" size="icon"><Icon icon="solar:close-circle-line-duotone" /></Button>
        <Button variant="destructive" size="icon-lg"><Icon icon="solar:close-circle-line-duotone" /></Button>
        <Button variant="destructive" size="icon-xl"><Icon icon="solar:close-circle-line-duotone" /></Button>
      </div>
    </div>
  ),
};

export const WithIconStart: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="xs"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
        <Button size="sm"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
        <Button><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
        <Button size="lg"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
        <Button size="xl"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="xs"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /> Save</Button>
        <Button variant="secondary" size="sm"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /> Save</Button>
        <Button variant="secondary"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /> Save</Button>
        <Button variant="secondary" size="lg"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /> Save</Button>
        <Button variant="secondary" size="xl"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /> Save</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="xs"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /> Share</Button>
        <Button variant="outline" size="sm"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /> Share</Button>
        <Button variant="outline"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /> Share</Button>
        <Button variant="outline" size="lg"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /> Share</Button>
        <Button variant="outline" size="xl"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /> Share</Button>
      </div>
    </div>
  ),
};

export const WithIconEnd: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="xs">Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button size="sm">Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button>Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button size="lg">Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button size="xl">Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="xs">Learn More <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="secondary" size="sm">Learn More <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="secondary">Learn More <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="secondary" size="lg">Learn More <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="secondary" size="xl">Learn More <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="xs">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="outline" size="sm">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="outline">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="outline" size="lg">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        <Button variant="outline" size="xl">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
      </div>
    </div>
  ),
};

export const WithAnimatedIconStart: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button animateIcon size="sm"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
      <Button animateIcon><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
      <Button animateIcon size="lg"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
      <Button animateIcon variant="secondary"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /> Save</Button>
      <Button animateIcon variant="outline"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /> Share</Button>
    </div>
  ),
};

export const WithAnimatedIconEnd: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button animateIcon size="sm">Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
      <Button animateIcon>Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
      <Button animateIcon size="lg">Next <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
      <Button animateIcon variant="secondary">Learn More <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
      <Button animateIcon variant="outline">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
    </div>
  ),
};

export const WithAnimatedText: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button animateText><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /><span data-label>Create</span></Button>
      <Button animateText variant="secondary"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /><span data-label>Save</span></Button>
      <Button animateText variant="outline"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /><span data-label>Share</span></Button>
      <Button animateText variant="tertiary"><Icon icon="solar:bookmark-line-duotone" data-icon="inline-start" /><span data-label>Bookmark</span></Button>
      <Button animateText size="lg"><Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /><span data-label>Next</span></Button>
    </div>
  ),
};

export const WithParentHoverTrigger: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="group rounded-2xl border border-border p-6 transition-shadow hover:shadow-lg">
        <p className="mb-4 text-sm text-muted-foreground">Hover this card to trigger the button animations</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button animateIcon hoverTrigger="parent"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</Button>
          <Button animateText hoverTrigger="parent"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /><span data-label>Save</span></Button>
          <Button animateIcon hoverTrigger="parent" variant="outline">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></Button>
        </div>
      </div>
    </div>
  ),
};
