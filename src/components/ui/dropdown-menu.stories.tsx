import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";
import { Button } from "./button";

const meta: Meta<typeof DropdownMenu> = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-[300px] items-start justify-center rounded-lg bg-gradient-to-br from-surface to-surface-container-high p-10">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Actions
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage Resource</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <div className="flex min-h-[300px] items-start justify-center rounded-lg bg-gradient-to-br from-surface to-surface-container-high p-10">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Options
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Quick Action</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to...</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Reading List</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem>Favorites</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            Show Preview
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
