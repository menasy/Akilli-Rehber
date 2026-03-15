import React from "react"
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useContactsStore } from "../store/contactsStore"

type SettingsContactsSyncRowProps = {
  colors: any
  t: (key: string) => string
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
}

export default function SettingsContactsSyncRow({
  colors,
  t,
  scale,
  verticalScale,
  moderateScale,
}: SettingsContactsSyncRowProps) {
  const loadContacts = useContactsStore((state: any) => state.loadContacts)
  const loading = useContactsStore((state: any) => state.loading)

  const handlePress = () => {
    if (loading) return
    void loadContacts()
  }

  const buttonLabelColor = loading ? colors.textSecondary : "#FFFFFF"

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.card,
          borderRadius: scale(16),
          marginHorizontal: scale(14),
          marginTop: verticalScale(14),
          padding: scale(20),
          minHeight: verticalScale(72),
        },
      ]}
    >
      <View style={styles.rowLeft}>
        <Ionicons name="refresh" size={moderateScale(28)} color={colors.primary} />
        <Text
          style={[
            styles.rowLabel,
            {
              color: colors.textPrimary,
              fontSize: moderateScale(20),
              marginLeft: scale(14),
            },
          ]}
        >
          {t("settings.contacts")}
        </Text>
      </View>
      <Pressable
        onPress={handlePress}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: loading ? colors.tabBarItemBg : colors.primary,
            borderRadius: scale(12),
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(10),
            opacity: loading ? 0.7 : pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.buttonContent, { gap: scale(6) }]}>
          {loading ? (
            <ActivityIndicator size="small" color={buttonLabelColor} />
          ) : null}
          <Text
            style={[
              styles.buttonText,
              { color: buttonLabelColor, fontSize: moderateScale(14) },
            ]}
          >
            {t("settings.fetchContacts")}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  rowLabel: {
    fontWeight: "600",
  },
  button: {
    alignSelf: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
  },
})
