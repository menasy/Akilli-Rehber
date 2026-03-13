import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

type FavoritesState = {
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "nasai-favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)