import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useContacts } from "../../src/hooks/useContacts"
import { useSearch } from "../../src/hooks/useSearch"
import ContactGrid from "../../src/components/ContactGrid"
import SearchBar from "../../src/components/SearchBar"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import { useResponsive } from "../../src/theme/responsive"

export default function Home() {
  const contacts = useContacts()
  const colors = useTheme()
  const { t } = useI18n()
  const { moderateScale, verticalScale } = useResponsive()
  const { query, setQuery, results } = useSearch(contacts)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar value={query} onChangeText={setQuery} />
      <ContactGrid contacts={results} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
