import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SelectedMenu from "./SelectedMenu"
import { DefaultScreen } from "../store/settingsStore"

const SCREENS: { key: DefaultScreen; icon: string; labelKey: string }[] = [
  { key: "index", icon: "home-outline", labelKey: "settings.screenHome" },
  { key: "favorites", icon: "heart-outline", labelKey: "settings.screenFavorites" },
  { key: "voice", icon: "mic-outline", labelKey: "settings.screenVoice" },
]

type SettingsDefaultScreenRowProps = {
  colors: any
  t: (key: string) => string
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
  defaultScreen: DefaultScreen
  setDefaultScreen: (screen: DefaultScreen) => void
}

export default function SettingsDefaultScreenRow({
  colors,
  t,
  scale,
  verticalScale,
  moderateScale,
  defaultScreen,
  setDefaultScreen,
}: SettingsDefaultScreenRowProps) {
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
      <View style={styles.rowLeft}>
        <Ionicons name="apps-outline" size={moderateScale(28)} color={colors.primary} />
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
          {t("settings.defaultScreen")}
        </Text>
      </View>
      <View
        style={[
          styles.screenRow,
          { marginTop: verticalScale(14), gap: scale(8) },
        ]}
      >
        {SCREENS.map((screen) => (
          <SelectedMenu
            key={screen.key}
            isSelected={defaultScreen === screen.key}
            iconName={screen.icon}
            label={t(screen.labelKey)}
            onPress={() => setDefaultScreen(screen.key)}
            colors={colors}
            scale={scale}
            verticalScale={verticalScale}
            moderateScale={moderateScale}
            iconSize={moderateScale(22)}
            labelSize={moderateScale(13)}
            activeTextColor="#FFFFFF"
            inactiveTextColor={colors.textSecondary}
            activeBgColor={colors.primary}
            inactiveBgColor={colors.tabBarItemBg}
            pressableStyle={styles.screenChip}
            innerStyle={{
              borderRadius: scale(10),
              paddingVertical: verticalScale(12),
            }}
            labelStyle={{ marginTop: verticalScale(4) }}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {},
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  rowLabel: {
    fontWeight: "600",
  },
  screenRow: {
    flexDirection: "row",
  },
  screenChip: {
    flex: 1,
  },
})
