import { I18nManager } from "react-native"
import type { Language } from "../store/settingsStore"

export function isRTLLanguage(language: Language): boolean {
  return language === "ar"
}

export function syncRTL(language: Language) {
  const shouldUseRTL = isRTLLanguage(language)

  I18nManager.allowRTL(shouldUseRTL)
  I18nManager.forceRTL(shouldUseRTL)
}