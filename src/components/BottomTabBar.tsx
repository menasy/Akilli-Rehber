import React from "react"
import { View, StyleSheet, Platform } from "react-native"
import { useTheme } from "../hooks/useTheme"
import { useResponsive } from "../theme/responsive"
import { useI18n } from "../i18n"
import SelectedMenu from "./SelectedMenu"

type TabBarProps = {
  state: any
  descriptors: any
  navigation: any
}

const TAB_CONFIG: Record<string, { active: string; inactive: string; labelKey: string }> = {
  index: { active: "home", inactive: "home-outline", labelKey: "tabs.home" },
  favorites: { active: "heart", inactive: "heart-outline", labelKey: "tabs.favorites" },
  voice: { active: "mic", inactive: "mic-outline", labelKey: "tabs.voice" },
  settings: { active: "settings", inactive: "settings-outline", labelKey: "tabs.settings" },
}

export default function BottomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const colors = useTheme()
  const { scale, verticalScale, moderateScale } = useResponsive()
  const { t } = useI18n()

  return (
    <View style={{ backgroundColor: colors.background }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.tabBarBg,
            borderRadius: scale(16),
            padding: scale(6),
            marginHorizontal: scale(12),
            marginBottom: verticalScale(8),
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.15,
                shadowRadius: 15,
              },
              android: {
                elevation: 8,
              },
            }),
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index
        const config = TAB_CONFIG[route.name] || {
          active: "help",
          inactive: "help-outline",
          labelKey: route.name,
        }

        return (
          <SelectedMenu
            key={route.key}
            isSelected={isFocused}
            iconName={isFocused ? config.active : config.inactive}
            label={t(config.labelKey)}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              })
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }}
            onLongPress={() => {
              navigation.emit({ type: "tabLongPress", target: route.key })
            }}
            colors={colors}
            scale={scale}
            verticalScale={verticalScale}
            moderateScale={moderateScale}
          />
        )
      })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
  },
})
