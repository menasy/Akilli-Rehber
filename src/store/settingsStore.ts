import { Appearance } from "react-native"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ThemeName } from "../theme/colors"
import { ContactSize } from "../types"
import { mmkvStorage } from "../storage/mmkv"

export type Language = "tr" | "ku"
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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      language: "tr",
      contactSize: "large",
      defaultScreen: "index",
      contactsBootstrapped: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setLanguage: (language) => set({ language }),
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
    }
  )
)
