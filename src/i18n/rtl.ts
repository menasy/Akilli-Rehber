import { I18nManager } from "react-native"
import type { Language } from "../store/settingsStore"

export function syncRTL(_language: Language) {
  I18nManager.allowRTL(false)
  I18nManager.forceRTL(false)
}
