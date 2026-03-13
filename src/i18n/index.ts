import { useSettingsStore } from "../store/settingsStore"
import type { Language } from "../store/settingsStore"
import tr from "./locales/tr.json"
import ku from "./locales/ku.json"

const translations: Record<Language, Record<string, any>> = { tr, ku }

function resolve(obj: Record<string, any>, key: string): string {
  const parts = key.split(".")
  let value: any = obj
  for (const part of parts) {
    value = value?.[part]
  }
  return typeof value === "string" ? value : key
}

export function useI18n() {
  const language = useSettingsStore((state) => state.language)

  const t = (key: string): string => resolve(translations[language], key)

  return { t, language }
}
