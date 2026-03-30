import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="readings">Readings</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4">
        <p>Overview content with tonal background shift for active tab.</p>
      </TabsContent>
      <TabsContent value="readings" className="p-4">
        <p>Readings list here.</p>
      </TabsContent>
      <TabsContent value="notes" className="p-4">
        <p>Notes content here.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="line">
        <TabsTrigger value="tab1">Resources</TabsTrigger>
        <TabsTrigger value="tab2">Collections</TabsTrigger>
        <TabsTrigger value="tab3">Saved</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-4">
        <p>Resources content.</p>
      </TabsContent>
      <TabsContent value="tab2" className="p-4">
        <p>Collections content.</p>
      </TabsContent>
      <TabsContent value="tab3" className="p-4">
        <p>Saved content.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-4">
        <p>Active tab content.</p>
      </TabsContent>
    </Tabs>
  ),
};
