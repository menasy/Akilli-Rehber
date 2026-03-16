import { Linking, Platform, PermissionsAndroid } from "react-native"
import * as IntentLauncher from "expo-intent-launcher"

export async function callNumber(phone: string) {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await IntentLauncher.startActivityAsync("android.intent.action.CALL", {
        data: `tel:${phone}`,
      })
    } else {
      Linking.openURL(`tel:${phone}`)
    }
  } else {
    Linking.openURL(`telprompt:${phone}`)
  }
}