import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="edit-contact"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  )
}