import { useFavoritesStore } from "../store/favoritesStore"
import { useContactsStore } from "../store/contactsStore"

export function useFavorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const isFavorite = useFavoritesStore((state) => state.isFavorite)
  const contacts = useContactsStore((state) => state.contacts)

  const favorites = contacts.filter((c) => favoriteIds.includes(c.id))

  return { favorites, toggleFavorite, isFavorite }
}