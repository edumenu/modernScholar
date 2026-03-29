import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "UI/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-[300px] items-start justify-center p-10">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Library</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-2 p-2">
                <NavigationMenuLink href="#">
                  <div>
                    <div className="font-medium">All Resources</div>
                    <div className="text-xs text-on-surface-variant">
                      Browse your complete academic library
                    </div>
                  </div>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <div>
                    <div className="font-medium">Collections</div>
                    <div className="text-xs text-on-surface-variant">
                      Organized groups of related materials
                    </div>
                  </div>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <div>
                    <div className="font-medium">Recent</div>
                    <div className="text-xs text-on-surface-variant">
                      Recently accessed resources
                    </div>
                  </div>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Dashboard</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Settings</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};
