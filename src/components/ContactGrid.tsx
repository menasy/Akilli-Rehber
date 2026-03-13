import React from "react"
import { FlatList, StyleSheet } from "react-native"
import ContactCard from "./ContactCard"
import { Contact } from "../types"
import { useResponsive } from "../theme/responsive"

interface ContactGridProps {
  contacts: Contact[]
}

export default function ContactGrid({ contacts }: ContactGridProps) {
  const { verticalScale } = useResponsive()

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ContactCard contact={item} />}
      contentContainerStyle={{ paddingBottom: verticalScale(16) }}
      showsVerticalScrollIndicator={false}
    />
  )
}
