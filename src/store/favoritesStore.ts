import { create } from "zustand"

type FavoritesState = {
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],

  toggleFavorite: (id: string) => {
    const current = get().favoriteIds
    if (current.includes(id)) {
      set({ favoriteIds: current.filter((fid) => fid !== id) })
    } else {
      set({ favoriteIds: [...current, id] })
    }
  },

  isFavorite: (id: string) => get().favoriteIds.includes(id),
}))