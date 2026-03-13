import { Tabs } from "expo-router"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import BottomTabBar from "../../src/components/BottomTabBar"
import { Platform } from "react-native"
import { useEffect } from "react"

export default function TabLayout() {
  const colors = useTheme()
  const { t } = useI18n()

  useEffect(() => {
    if (Platform.OS === "android") {
      try {
        const NavigationBar = require("expo-navigation-bar")
        NavigationBar.setVisibilityAsync("hidden")
        NavigationBar.setBehaviorAsync("overlay-swipe")
      } catch {}
    }
  }, [])

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
