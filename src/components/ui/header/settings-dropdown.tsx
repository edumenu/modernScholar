"use client"

import { Icon } from "@iconify/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import { useSettingsStore } from "@/stores/settings-store"
import { cn } from "@/lib/utils"

export function SettingsDropdown({ className }: { className?: string }) {
  const { cursorEnabled, setCursorEnabled } = useSettingsStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center justify-center rounded-full px-3 cursor-pointer outline-none text-on-surface-variant transition-colors hover:text-primary",
          className,
        )}
        aria-label="Cursor settings"
      >
        <Icon icon="solar:settings-line-duotone" className="size-6" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Cursor</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={cursorEnabled ? "custom" : "default"}
            onValueChange={(v) => setCursorEnabled(v === "custom")}
          >
            <DropdownMenuRadioItem value="default">
              <Icon
                icon="solar:cursor-line-duotone"
                className="size-4 text-on-surface-variant"
              />
              Default
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="custom">
              <Icon
                icon="solar:cursor-bold-duotone"
                className="size-4 text-on-surface-variant"
              />
              Custom
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
