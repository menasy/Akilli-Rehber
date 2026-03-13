import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import { useResponsive } from "../../src/theme/responsive"
import { useFavorites } from "../../src/hooks/useFavorites"
import { useSearch } from "../../src/hooks/useSearch"
import { useContacts } from "../../src/hooks/useContacts"
import { Ionicons } from "@expo/vector-icons"
import SearchBar from "../../src/components/SearchBar"
import ContactGrid from "../../src/components/ContactGrid"

export default function Favorites() {
  const colors = useTheme()
  const { t } = useI18n()
  const { moderateScale, verticalScale } = useResponsive()

  // Kişileri yükle (henüz yüklenmediyse)
  useContacts()
  const { favorites } = useFavorites()
  const { query, setQuery, results } = useSearch(favorites)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar value={query} onChangeText={setQuery} />
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="heart-outline"
            size={moderateScale(64)}
            color={colors.favoriteInactive}
          />
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.textSecondary,
                fontSize: moderateScale(18),
                marginTop: verticalScale(12),
              },
            ]}
          >
            {t("favorites.empty")}
          </Text>
        </View>
      ) : (
        <ContactGrid contacts={results} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontWeight: "600",
  },
})
