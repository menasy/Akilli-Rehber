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
  small: {
    avatar: 100,
    buttonWRatio: 0.6,
    buttonH: 44,
    nameFont: 18,
    callFont: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    nameMarginTop: 10,
    buttonMarginTop: 12,
  },
  medium: {
    avatar: 150,
    buttonWRatio: 0.68,
    buttonH: 54,
    nameFont: 21,
    callFont: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    nameMarginTop: 10,
    buttonMarginTop: 12,
  },
  large: {
    avatar: 250,
    buttonWRatio: 0.84,
    buttonH: 76,
    nameFont: 30,
    callFont: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 20,
    nameMarginTop: 14,
    buttonMarginTop: 16,
  },
}

interface ContactCardProps {
  contact: Contact
}

export default function ContactCard({ contact }: ContactCardProps) {
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
          paddingVertical: verticalScale(cfg.paddingVertical),
          paddingHorizontal: scale(cfg.paddingHorizontal),
          borderRadius: scale(cfg.borderRadius),
        },
      ]}
    >
      {/* Favori butonu - sağ üst */}
      <View style={styles.favoriteWrapper}>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => toggleFavorite(contact.id)}
        />
      </View>

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
            marginTop: verticalScale(cfg.nameMarginTop),
          },
        ]}
        numberOfLines={2}
      >
        {contact.name}
      </Text>

      <Pressable
        onPress={() => callNumber(contact.phone)}
        style={({ pressed }) => [
          styles.callButton,
          {
            backgroundColor: pressed ? colors.primaryPressed : colors.primary,
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: scale(12),
            marginTop: verticalScale(cfg.buttonMarginTop),
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
