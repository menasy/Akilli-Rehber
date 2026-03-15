import { Redirect } from "expo-router"
import { getInitialDefaultScreen } from "../src/store/settingsStore"

function getInitialHref() {
  const initialScreen = getInitialDefaultScreen()

  if (initialScreen === "index") {
    return "/(tabs)"
  }

  return `/(tabs)/${initialScreen}` as const
}

export default function AppIndex() {
  return <Redirect href={getInitialHref()} />
}
