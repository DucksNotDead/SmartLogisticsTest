import { create } from 'zustand'

type ChromeTitleState = {
  title: string | null
  compactVisible: boolean
  setTitle: (title: string | null) => void
  setCompactVisible: (visible: boolean) => void
  reset: () => void
}

export const useChromeTitleStore = create<ChromeTitleState>((set) => ({
  title: null,
  compactVisible: false,
  setTitle: (title) => set({ title }),
  setCompactVisible: (compactVisible) => set({ compactVisible }),
  reset: () => set({ title: null, compactVisible: false }),
}))
