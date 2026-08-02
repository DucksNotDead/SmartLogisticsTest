import { create } from 'zustand'

type FiltersUiState = {
  open: boolean
  openFilters: () => void
  closeFilters: () => void
  setOpen: (open: boolean) => void
}

export const useFiltersUiStore = create<FiltersUiState>((set) => ({
  open: false,
  openFilters: () => set({ open: true }),
  closeFilters: () => set({ open: false }),
  setOpen: (open) => set({ open }),
}))
