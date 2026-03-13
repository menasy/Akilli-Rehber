import { useSettingsStore } from "../store/settingsStore"
import { themes } from "../theme/colors"

export function useTheme() {
  const theme = useSettingsStore((state) => state.theme)
  return themes[theme]
}
