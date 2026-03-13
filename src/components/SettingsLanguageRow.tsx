import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Language } from "../store/settingsStore"
import SelectedMenu from "./SelectedMenu"

type SettingsLanguageRowProps = {
  colors: any
  t: (key: string) => string
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
  language: Language
  setLanguage: (language: Language) => void
}

export default function SettingsLanguageRow({
  colors,
  t,
  scale,
  verticalScale,
  moderateScale,
  language,
  setLanguage,
}: SettingsLanguageRowProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: scale(16),
          marginHorizontal: scale(14),
          marginTop: verticalScale(14),
          padding: scale(20),
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Ionicons
          name="language"
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
          {t("settings.language")}
        </Text>
      </View>
      <View style={[styles.langRow, { gap: scale(8), marginTop: verticalScale(12) }]}>
        <SelectedMenu
          isSelected={language === "tr"}
          label="Türkçe"
          onPress={() => setLanguage("tr")}
          colors={colors}
          scale={scale}
          verticalScale={verticalScale}
          moderateScale={moderateScale}
          labelSize={moderateScale(15)}
          activeTextColor="#FFFFFF"
          inactiveTextColor={colors.textSecondary}
          activeBgColor={colors.primary}
          inactiveBgColor={colors.tabBarItemBg}
          pressableStyle={styles.langChip}
          innerStyle={{
            borderRadius: scale(10),
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(18),
            width: "100%",
          }}
          labelStyle={{ marginTop: 0 }}
        />
        <SelectedMenu
          isSelected={language === "ku"}
          label="Kurdî"
          onPress={() => setLanguage("ku")}
          colors={colors}
          scale={scale}
          verticalScale={verticalScale}
          moderateScale={moderateScale}
          labelSize={moderateScale(15)}
          activeTextColor="#FFFFFF"
          inactiveTextColor={colors.textSecondary}
          activeBgColor={colors.primary}
          inactiveBgColor={colors.tabBarItemBg}
          pressableStyle={styles.langChip}
          innerStyle={{
            borderRadius: scale(10),
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(18),
            width: "100%",
          }}
          labelStyle={{ marginTop: 0 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  rowLabel: {
    fontWeight: "600",
  },
  langRow: {
    flexDirection: "row",
  },
  langChip: {
    flex: 1,
  },
})
