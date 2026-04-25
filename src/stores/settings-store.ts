import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsState {
  cursorEnabled: boolean
  setCursorEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      cursorEnabled: false,
      setCursorEnabled: (enabled) => set({ cursorEnabled: enabled }),
    }),
    { name: "ms-settings" },
  ),
)
