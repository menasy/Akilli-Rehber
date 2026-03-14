import { Appearance } from "react-native"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ThemeName } from "../theme/colors"
import { ContactSize } from "../types"
import { mmkv, mmkvStorage } from "../storage/mmkv"
import { syncRTL } from "../i18n/rtl"

export type Language = "tr" | "ku" | "ar"
export type DefaultScreen = "index" | "favorites" | "voice"

type SettingsState = {
  theme: ThemeName
  language: Language
  contactSize: ContactSize
  defaultScreen: DefaultScreen
  contactsBootstrapped: boolean
  setTheme: (theme: ThemeName) => void
  toggleTheme: () => void
  setLanguage: (language: Language) => void
  setContactSize: (size: ContactSize) => void
  setDefaultScreen: (screen: DefaultScreen) => void
  setContactsBootstrapped: (value: boolean) => void
}

function getInitialTheme(): ThemeName {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  return Appearance.getColorScheme() === "dark" ? "dark" : "light"
}

function getInitialLanguage(): Language {
  const persisted = mmkv.getString("nasai-settings")
  if (!persisted) return "tr"

  try {
    const parsed = JSON.parse(persisted) as { state?: { language?: Language } }
    return parsed.state?.language ?? "tr"
  } catch {
    return "tr"
  }
}

const initialLanguage = getInitialLanguage()
syncRTL(initialLanguage)

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      language: initialLanguage,
      contactSize: "large",
      defaultScreen: "index",
      contactsBootstrapped: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setLanguage: (language) => {
        syncRTL(language)
        set({ language })
      },
      setContactSize: (contactSize) => set({ contactSize }),
      setDefaultScreen: (defaultScreen) => set({ defaultScreen }),
      setContactsBootstrapped: (contactsBootstrapped) => set({ contactsBootstrapped }),
    }),
    {
      name: "nasai-settings",
      storage: mmkvStorage,
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        contactSize: state.contactSize,
        defaultScreen: state.defaultScreen,
        contactsBootstrapped: state.contactsBootstrapped,
      }),
      onRehydrateStorage: () => (state) => {
        syncRTL(state?.language ?? "tr")
      },
    }
  )
)
