import { Linking, Alert } from "react-native"
import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js"

/**
 * Normalizes a phone number for WhatsApp.
 * It removes all spaces, +, dashes, and leading zeros.
 * Requires the number to be parsed correctly. If it doesn't have an international prefix,
 * we assume a default country code.
 */
export function normalizePhoneForWhatsApp(rawPhone: string, defaultCountry: CountryCode = "TR"): string | null {
  try {
    // libphonenumber-js handles numbers starting with "00" implicitly in some cases,
    // but to be perfectly robust we can pre-replace "00" with "+" if it starts with it.
    let numberToParse = rawPhone.trim()
    if (numberToParse.startsWith("00")) {
      numberToParse = "+" + numberToParse.slice(2)
    }

    const parsed = parsePhoneNumberFromString(numberToParse, defaultCountry)
    if (parsed && parsed.isValid()) {
      // number is in E.164 format, e.g., +905321234567
      // WhatsApp requires format without the plus: 905321234567
      return parsed.number.replace("+", "")
    }
  } catch (error) {
    console.error("Phone parsing error:", error)
  }

  return null
}

export type WhatsAppOpenResult = {
  success: boolean
  errorKey?: string
}

/**
 * Opens WhatsApp for the given phone number.
 * Translates the number to international format and opens wa.me.
 */
export async function openWhatsAppContact(rawPhone: string): Promise<WhatsAppOpenResult> {
  const normalized = normalizePhoneForWhatsApp(rawPhone)

  if (!normalized) {
    return { success: false, errorKey: "error.invalidPhone" }
  }

  const url = `https://wa.me/${normalized}`

  try {
    const canOpen = await Linking.canOpenURL(url)
    if (!canOpen) {
      return { success: false, errorKey: "error.whatsappNotInstalled" }
    }

    await Linking.openURL(url)
    return { success: true }
  } catch (err) {
    console.error("WhatsApp open error:", err)
    return { success: false, errorKey: "error.whatsappNotOpened" }
  }
}
