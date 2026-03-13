import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ThemeSwitch from "./ThemeSwitch"

type SettingsThemeRowProps = {
  colors: any
  t: (key: string) => string
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
  theme: "light" | "dark"
  toggleTheme: () => void
}

export default function SettingsThemeRow({
  colors,
  t,
  scale,
  verticalScale,
  moderateScale,
  theme,
  toggleTheme,
}: SettingsThemeRowProps) {
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.card,
          borderRadius: scale(16),
          marginHorizontal: scale(14),
          marginTop: verticalScale(16),
          padding: scale(20),
          minHeight: verticalScale(72),
        },
      ]}
    >
      <View style={styles.rowLeft}>
        <Ionicons
          name={theme === "dark" ? "moon" : "sunny"}
          size={moderateScale(28)}
          color={colors.primary}
        />
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
          {t("settings.theme")}
        </Text>
      </View>
      <ThemeSwitch isDark={theme === "dark"} onToggle={toggleTheme} />
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
})
