import React, { useRef, useEffect } from "react"
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"
import { useResponsive } from "../theme/responsive"
import { useI18n } from "../i18n"

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

function TabItem({
  isFocused,
  iconName,
  label,
  onPress,
  onLongPress,
  colors,
  scale,
  verticalScale,
  moderateScale,
}: {
  isFocused: boolean
  iconName: string
  label: string
  onPress: () => void
  onLongPress: () => void
  colors: any
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
}) {
  const animValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isFocused) {
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      animValue.setValue(0)
    }
  }, [isFocused, animValue])

  const scaleAnim = animValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 1.08, 1],
  })

  const translateY = animValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, -2, 2],
  })

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabItem}>
      <Animated.View
        style={[
          styles.tabItemInner,
          {
            borderRadius: scale(12),
            paddingVertical: verticalScale(8),
            paddingHorizontal: scale(4),
            backgroundColor: isFocused ? colors.primary : colors.tabBarItemBg,
            transform: [{ scale: scaleAnim }, { translateY }],
            ...Platform.select({
              ios: {
                shadowColor: isFocused ? colors.primary : "#000",
                shadowOffset: isFocused
                  ? { width: 0, height: 3 }
                  : { width: 3, height: 3 },
                shadowOpacity: isFocused ? 0.3 : 0.1,
                shadowRadius: isFocused ? 8 : 6,
              },
              android: {
                elevation: isFocused ? 6 : 3,
              },
            }),
          },
        ]}
      >
        <Ionicons
          name={iconName as any}
          size={moderateScale(20)}
          color={isFocused ? colors.tabBarActiveText : colors.tabBarInactiveText}
        />
        <Text
          style={[
            styles.tabLabel,
            {
              fontSize: moderateScale(10),
              color: isFocused ? colors.tabBarActiveText : colors.tabBarInactiveText,
              fontWeight: isFocused ? "700" : "500",
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  )
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
          <TabItem
            key={route.key}
            isFocused={isFocused}
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
  tabItem: {
    flex: 1,
  },
  tabItemInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    marginTop: 2,
    fontFamily: "System",
  },
})
