import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ThemeName } from "../theme/colors"
import { ContactSize } from "../types"

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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
