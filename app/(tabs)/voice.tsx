import { View, StyleSheet } from "react-native"
import { useTheme } from "../../src/hooks/useTheme"
import { useVoiceSearch } from "../../src/hooks/useVoiceSearch"
import VoiceSearchModal from "../../src/components/VoiceSearchModal"

export default function Voice() {
  const colors = useTheme()
  const { state, startListening, stopListening, reset, callMatch } = useVoiceSearch()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VoiceSearchModal
        state={state}
        onStartListening={startListening}
        onStopListening={stopListening}
        onReset={reset}
        onCallMatch={callMatch}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
