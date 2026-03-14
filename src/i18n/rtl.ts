import { I18nManager } from "react-native"
import type { Language } from "../store/settingsStore"

export function isRTLLanguage(language: Language): boolean {
  return language === "ar"
}

export function syncRTL(_language: Language) {
  // Layout her zaman LTR kalacak.
  // Uygulama bileşenleri RTL layout için tasarlanmadığından
  // forceRTL aktifken bottombar, settings vb. ters dönüyordu.
  I18nManager.allowRTL(false)
  I18nManager.forceRTL(false)
}