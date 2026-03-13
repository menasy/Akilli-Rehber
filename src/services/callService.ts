import { Linking, Platform } from "react-native"

export function callNumber(phone: string) {
  const url = Platform.OS === "android" ? `tel:${phone}` : `telprompt:${phone}`
  Linking.openURL(url)
}