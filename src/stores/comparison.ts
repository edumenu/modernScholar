import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ComparisonState {
  selectedIds: string[]
  isSheetOpen: boolean
  add: (id: string) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  clear: () => void
  isSelected: (id: string) => boolean
  openSheet: () => void
  closeSheet: () => void
}

const MAX_COMPARE = 3

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      isSheetOpen: false,
      add: (id) =>
        set((state) => {
          if (state.selectedIds.length >= MAX_COMPARE) return state
          if (state.selectedIds.includes(id)) return state
          return { selectedIds: [...state.selectedIds, id] }
        }),
      remove: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.filter((s) => s !== id),
        })),
      toggle: (id) => {
        const { selectedIds, add, remove } = get()
        if (selectedIds.includes(id)) {
          remove(id)
        } else {
          add(id)
        }
      },
      clear: () => set({ selectedIds: [], isSheetOpen: false }),
      isSelected: (id) => get().selectedIds.includes(id),
      openSheet: () => set({ isSheetOpen: true }),
      closeSheet: () => set({ isSheetOpen: false }),
    }),
    {
      name: "ms-comparison",
      // Only persist the user's selected ids — sheet open-state should reset
      // on reload so the page never reopens the sheet over a fresh visit.
      partialize: (state) => ({ selectedIds: state.selectedIds }),
      // Defer rehydration so the SSR-rendered HTML (empty selectedIds) matches
      // the first client render. <ComparisonRehydrator /> in layout.tsx pulls
      // the persisted state in via useEffect after mount.
      skipHydration: true,
    },
  ),
)
