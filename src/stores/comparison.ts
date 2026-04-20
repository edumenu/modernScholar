import { create } from "zustand"

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

export const useComparisonStore = create<ComparisonState>()((set, get) => ({
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
}))
