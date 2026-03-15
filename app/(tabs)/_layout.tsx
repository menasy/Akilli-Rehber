import { Tabs } from "expo-router"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import BottomTabBar from "../../src/components/BottomTabBar"
import { AppState, Platform } from "react-native"
import { useEffect, useRef } from "react"
import { getInitialDefaultScreen } from "../../src/store/settingsStore"

const initialScreen = getInitialDefaultScreen()

function hideNavigationBar() {
  if (Platform.OS !== "android") return
  try {
    const NavigationBar = require("expo-navigation-bar")
    NavigationBar.setPositionAsync("absolute")
    NavigationBar.setBackgroundColorAsync("transparent")
    NavigationBar.setBehaviorAsync("overlay-swipe")
    NavigationBar.setVisibilityAsync("hidden")
  } catch {}
}

export default function TabLayout() {
  const colors = useTheme()
  const { t } = useI18n()
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    hideNavigationBar()

    const sub = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        hideNavigationBar()
      }
      appState.current = nextState
    })

    return () => sub.remove()
  }, [])

  return (
    <Tabs
      initialRouteName={initialScreen}
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        animation: "none",
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("home.title") }} />
      <Tabs.Screen name="favorites" options={{ title: t("favorites.title") }} />
      <Tabs.Screen name="voice" options={{ title: t("voice.title") }} />
      <Tabs.Screen name="settings" options={{ title: t("settings.title") }} />
    </Tabs>
  )
}
