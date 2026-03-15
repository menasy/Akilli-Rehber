import { useMemo } from "react"
import { useFavoritesStore } from "../store/favoritesStore"
import { useContactsStore } from "../store/contactsStore"

export function useFavorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const isFavorite = useFavoritesStore((state) => state.isFavorite)
  const contacts = useContactsStore((state) => state.contacts)

  const favorites = useMemo(() => {
    const idSet = new Set(favoriteIds)
    return contacts.filter((c) => idSet.has(c.id))
  }, [contacts, favoriteIds])

  return { favorites, toggleFavorite, isFavorite }
}
