import React from "react"
import { View, Text, Image, Pressable, StyleSheet } from "react-native"
import { callNumber } from "../services/callService"
import { Contact } from "../types"
import { useTheme } from "../hooks/useTheme"
import { useResponsive } from "../theme/responsive"
import { useI18n } from "../i18n"
import FavoriteButton from "./FavoriteButton"
import { useFavoritesStore } from "../store/favoritesStore"
import { useSettingsStore } from "../store/settingsStore"

const SIZE_CONFIG = {
  small: { avatar: 100, buttonWRatio: 0.6, buttonH: 44, nameFont: 18, callFont: 16 },
  medium: { avatar: 150, buttonWRatio: 0.68, buttonH: 54, nameFont: 21, callFont: 18 },
  large: { avatar: 220, buttonWRatio: 0.78, buttonH: 68, nameFont: 26, callFont: 22 },
}

interface ContactCardProps {
  contact: Contact
  onCall?: (contact: Contact) => void
  showFavoriteButton?: boolean
}

export default function ContactCard({
  contact,
  onCall,
  showFavoriteButton = true,
}: ContactCardProps) {
  const colors = useTheme()
  const { scale, verticalScale, moderateScale, width } = useResponsive()
  const { t } = useI18n()
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(contact.id))
  const contactSize = useSettingsStore((state) => state.contactSize)

  const cfg = SIZE_CONFIG[contactSize]
  const cardWidth = width - scale(24)
  const avatarSize = Math.min(scale(cfg.avatar), cardWidth * 0.6)
  const buttonWidth = Math.min(scale(247), cardWidth * cfg.buttonWRatio)
  const buttonHeight = verticalScale(cfg.buttonH)

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          marginVertical: verticalScale(8),
          marginHorizontal: scale(12),
          paddingVertical: verticalScale(14),
          paddingHorizontal: scale(12),
          borderRadius: scale(16),
        },
      ]}
    >
      {showFavoriteButton ? (
        <View style={styles.favoriteWrapper}>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => toggleFavorite(contact.id)}
          />
        </View>
      ) : null}

      <Image
        source={
          contact.avatar && contact.avatar.length > 0
            ? { uri: contact.avatar }
            : require("../../assets/icon.png")
        }
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      />

      <Text
        style={[
          styles.name,
          {
            color: colors.textPrimary,
            fontSize: moderateScale(cfg.nameFont),
            marginTop: verticalScale(10),
          },
        ]}
        numberOfLines={2}
      >
        {contact.name}
      </Text>

      <Pressable
        onPress={() => (onCall ? onCall(contact) : callNumber(contact.phone))}
        style={({ pressed }) => [
          styles.callButton,
          {
            backgroundColor: pressed ? colors.primaryPressed : colors.primary,
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: scale(12),
            marginTop: verticalScale(12),
          },
        ]}
      >
        <Text style={[styles.callButtonText, { fontSize: moderateScale(cfg.callFont) }]}>
          {t("home.call")}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderWidth: 1,
  },
  favoriteWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  avatar: {},
  name: {
    fontWeight: "700",
    textAlign: "center",
  },
  callButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  callButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
})
