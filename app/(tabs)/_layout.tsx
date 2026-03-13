import { Tabs, useRouter } from "expo-router"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import BottomTabBar from "../../src/components/BottomTabBar"
import { Platform } from "react-native"
import { useEffect, useRef } from "react"
import { useSettingsStore } from "../../src/store/settingsStore"

export default function TabLayout() {
  const colors = useTheme()
  const { t } = useI18n()
  const router = useRouter()
  const defaultScreen = useSettingsStore((state) => state.defaultScreen)
  const hasNavigated = useRef(false)

  useEffect(() => {
    if (Platform.OS === "android") {
      try {
        const NavigationBar = require("expo-navigation-bar")
        NavigationBar.setVisibilityAsync("hidden")
        NavigationBar.setBehaviorAsync("overlay-swipe")
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (!hasNavigated.current && defaultScreen && defaultScreen !== "index") {
      hasNavigated.current = true
      const timer = setTimeout(() => {
        router.replace(`/(tabs)/${defaultScreen}` as any)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [defaultScreen, router])

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("home.title") }} />
      <Tabs.Screen name="favorites" options={{ title: t("favorites.title") }} />
      <Tabs.Screen name="voice" options={{ title: t("voice.title") }} />
      <Tabs.Screen name="settings" options={{ title: t("settings.title") }} />
    </Tabs>
  )
}
