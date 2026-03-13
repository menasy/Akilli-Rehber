import { Linking, Platform, PermissionsAndroid } from "react-native"

async function requestCallPermission() {

  if (Platform.OS !== "android") return true

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CALL_PHONE
  )

  return granted === PermissionsAndroid.RESULTS.GRANTED
}

export async function callNumber(phone: string) {

    const cleanPhone = phone.replace(/\s+/g, "")
  if (Platform.OS === "android") {

    const allowed = await requestCallPermission()

    if (!allowed) {
      console.log("CALL_PHONE izni verilmedi")
      return
    }

    Linking.openURL(`tel:${cleanPhone}`)
  }

  else {

    // iOS maksimum izin verilen yöntem
    Linking.openURL(`telprompt:${cleanPhone}`)

  }
}