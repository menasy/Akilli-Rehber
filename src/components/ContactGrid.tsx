import React, { useCallback } from "react"
import { FlatList } from "react-native"
import ContactCard from "./ContactCard"
import { Contact } from "../types"
import { useResponsive } from "../theme/responsive"

interface ContactGridProps {
  contacts: Contact[]
}

const ITEM_HEIGHT_ESTIMATE = 350

export default function ContactGrid({ contacts }: ContactGridProps) {
  const { verticalScale } = useResponsive()

  const renderItem = useCallback(
    ({ item }: { item: Contact }) => <ContactCard contact={item} />,
    []
  )

  const keyExtractor = useCallback((item: Contact) => item.id, [])

  return (
    <FlatList
      data={contacts}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: verticalScale(16) }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      maxToRenderPerBatch={8}
      windowSize={5}
      initialNumToRender={5}
      getItemLayout={(_data, index) => ({
        length: ITEM_HEIGHT_ESTIMATE,
        offset: ITEM_HEIGHT_ESTIMATE * index,
        index,
      })}
    />
  )
}
