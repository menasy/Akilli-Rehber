import React, { useCallback } from "react"
import { FlatList } from "react-native"
import ContactCard from "./ContactCard"
import { Contact } from "../types"
import { useResponsive } from "../theme/responsive"
import { useSettingsStore } from "../store/settingsStore"

interface ContactGridProps {
  contacts: Contact[]
}

export default function ContactGrid({ contacts }: ContactGridProps) {
  const { verticalScale } = useResponsive()
  const contactSize = useSettingsStore((state) => state.contactSize)

  const renderItem = useCallback(
    ({ item }: { item: Contact }) => <ContactCard contact={item} />,
    []
  )

  const keyExtractor = useCallback((item: Contact) => item.id, [])

  return (
    <FlatList
      key={contactSize}
      data={contacts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: verticalScale(16) }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      maxToRenderPerBatch={4}
      updateCellsBatchingPeriod={50}
      windowSize={3}
      initialNumToRender={3}
    />
  )
}
