import { create } from "zustand"
import { ThemeName } from "../theme/colors"
import { ContactSize } from "../types"

export type Language = "tr" | "ku"

type SettingsState = {
  theme: ThemeName
  language: Language
  contactSize: ContactSize
  setTheme: (theme: ThemeName) => void
  toggleTheme: () => void
  setLanguage: (language: Language) => void
  setContactSize: (size: ContactSize) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "light",
  language: "tr",
  contactSize: "large",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setLanguage: (language) => set({ language }),
  setContactSize: (contactSize) => set({ contactSize }),
}))
