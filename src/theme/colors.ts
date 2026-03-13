export const lightColors = {
  background: "#FFFFFF",
  card: "#F5F5F5",
  sidebar: "#FAFAFA",
  textPrimary: "#1A1A1A",
  textSecondary: "#424242",
  textDisabled: "#9E9E9E",
  primary: "#2E7D32",
  primaryPressed: "#43A047",
  favoriteActive: "#E53935",
  favoriteInactive: "#BDBDBD",
  border: "#E0E0E0",
  searchBackground: "#EEEEEE",
  searchText: "#1A1A1A",
  searchIcon: "#616161",
  tabBarBg: "#EEEEEE",
  tabBarItemBg: "#F5F5F5",
  tabBarShadowDark: "rgba(0, 0, 0, 0.15)",
  tabBarShadowLight: "rgba(255, 255, 255, 0.8)",
  tabBarActiveText: "#FFFFFF",
  tabBarInactiveText: "#616161",
} as const

export const darkColors = {
  background: "#1C1C1E",
  card: "#2C2C2E",
  sidebar: "#242426",
  textPrimary: "#FFFFFF",
  textSecondary: "#E0E0E0",
  textDisabled: "#8E8E93",
  primary: "#4CAF50",
  primaryPressed: "#66BB6A",
  favoriteActive: "#EF5350",
  favoriteInactive: "#616161",
  border: "#3A3A3C",
  searchBackground: "#3A3A3C",
  searchText: "#FFFFFF",
  searchIcon: "#AEAEB2",
  tabBarBg: "#2C2C2E",
  tabBarItemBg: "#3A3A3C",
  tabBarShadowDark: "rgba(0, 0, 0, 0.3)",
  tabBarShadowLight: "rgba(255, 255, 255, 0.05)",
  tabBarActiveText: "#FFFFFF",
  tabBarInactiveText: "#AEAEB2",
} as const

export const themes = {
  light: lightColors,
  dark: darkColors,
} as const

export type ThemeName = keyof typeof themes
export type ThemeColors = (typeof themes)[ThemeName]
