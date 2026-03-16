import { useMemo } from "react"
import { useFavoritesStore } from "../store/favoritesStore"
import { useMergedContacts } from "./useMergedContacts"

export function useFavorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const contacts = useMergedContacts()

  const favorites = useMemo(() => {
    const idSet = new Set(favoriteIds)
    return contacts.filter((c) => idSet.has(c.id))
  }, [contacts, favoriteIds])

  return { favorites, toggleFavorite }
}
