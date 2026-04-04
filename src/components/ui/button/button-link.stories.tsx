import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icon } from "@iconify/react";
import { ButtonLink } from "./button-link";

const meta: Meta<typeof ButtonLink> = {
  title: "UI/ButtonLink",
  component: ButtonLink,
  tags: ["autodocs"],
  args: {
    href: "#",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "tertiary", "ghost", "outline", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "xl", "icon", "icon-xs", "icon-sm", "icon-lg", "icon-xl"],
    },
    animateIcon: { control: "boolean" },
    animateText: { control: "boolean" },
    hoverTrigger: {
      control: "select",
      options: ["self", "parent"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof ButtonLink>;

export const Default: Story = {
  args: { children: "Navigate" },
};

export const Secondary: Story = {
  args: { children: "Secondary Link", variant: "secondary" },
};

export const Tertiary: Story = {
  args: { children: "Tertiary Link", variant: "tertiary" },
};

export const Outline: Story = {
  args: { children: "Outline Link", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Ghost Link", variant: "ghost" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink href="#">Primary</ButtonLink>
      <ButtonLink href="#" variant="secondary">Secondary</ButtonLink>
      <ButtonLink href="#" variant="tertiary">Tertiary</ButtonLink>
      <ButtonLink href="#" variant="ghost">Ghost</ButtonLink>
      <ButtonLink href="#" variant="outline">Outline</ButtonLink>
      <ButtonLink href="#" variant="destructive">Destructive</ButtonLink>
      <ButtonLink href="#" variant="link">Link</ButtonLink>
    </div>
  ),
};

export const WithIconEnd: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink href="#">View All <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></ButtonLink>
      <ButtonLink href="#" variant="secondary">Learn More <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></ButtonLink>
      <ButtonLink href="#" variant="outline">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></ButtonLink>
    </div>
  ),
};

export const WithAnimatedIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink href="#" animateIcon><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</ButtonLink>
      <ButtonLink href="#" animateIcon>View All <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></ButtonLink>
      <ButtonLink href="#" animateIcon variant="secondary"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /> Save</ButtonLink>
      <ButtonLink href="#" animateIcon variant="outline">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></ButtonLink>
    </div>
  ),
};

export const WithAnimatedText: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink href="#" animateText><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /><span data-label>Create</span></ButtonLink>
      <ButtonLink href="#" animateText variant="secondary"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /><span data-label>Save</span></ButtonLink>
      <ButtonLink href="#" animateText variant="outline"><Icon icon="solar:share-line-duotone" data-icon="inline-start" /><span data-label>Share</span></ButtonLink>
      <ButtonLink href="#" animateText size="lg"><Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /><span data-label>Next</span></ButtonLink>
    </div>
  ),
};

export const WithParentHoverTrigger: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="group rounded-2xl border border-border p-6 transition-shadow hover:shadow-lg">
        <p className="mb-4 text-sm text-muted-foreground">Hover this card to trigger the link animations</p>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="#" animateIcon hoverTrigger="parent"><Icon icon="solar:add-circle-line-duotone" data-icon="inline-start" /> Create</ButtonLink>
          <ButtonLink href="#" animateText hoverTrigger="parent"><Icon icon="solar:heart-line-duotone" data-icon="inline-start" /><span data-label>Save</span></ButtonLink>
          <ButtonLink href="#" animateIcon hoverTrigger="parent" variant="outline">Explore <Icon icon="solar:arrow-right-line-duotone" data-icon="inline-end" /></ButtonLink>
        </div>
      </div>
    </div>
  ),
};
