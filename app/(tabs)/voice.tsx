import React, { useCallback } from "react"
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import { useResponsive } from "../../src/theme/responsive"
import { useVoiceSearch } from "../../src/hooks/useVoiceSearch"
import ContactGrid from "../../src/components/ContactGrid"

export default function Voice() {
  const colors = useTheme()
  const { t } = useI18n()
  const { scale, verticalScale, moderateScale } = useResponsive()
  const {
    isListening,
    isProcessing,
    transcript,
    matches,
    error,
    showResults,
    startVoiceSearch,
    stopVoiceSearch,
    reset,
  } = useVoiceSearch()

  const hasAttemptedSearch = Boolean(error || isProcessing || showResults)
  const showRetry = !isListening && hasAttemptedSearch
  const hasResults = showResults && matches.length > 0
  const resultContacts = matches.map((item) => item.contact)
  const showTranscript = Boolean(transcript && (isListening || isProcessing || showRetry))

  const handleMicPress = () => {
    if (isListening) {
      stopVoiceSearch()
      return
    }

    startVoiceSearch()
  }

  const statusText = error
    ? t("voice.start")
    : isListening
      ? t("voice.listening")
      : t("voice.start")

  const instructionText = isListening
    ? t("voice.stop")
    : showRetry
      ? null
      : t("voice.examplePrompt")

  const iconName = error
    ? "mic-outline"
    : isListening
      ? "mic"
      : "mic-outline"

  const micColor = error
    ? colors.primary
    : isListening
      ? colors.favoriteActive
      : colors.primary

  const transcriptContent = showTranscript ? (
    <View
      style={[
        styles.transcriptBox,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: scale(16),
          paddingHorizontal: scale(18),
          paddingVertical: verticalScale(12),
        },
      ]}
    >
      <Text
        style={[
          styles.transcriptLabel,
          {
            color: colors.textSecondary,
            fontSize: moderateScale(13),
            marginBottom: verticalScale(4),
          },
        ]}
      >
        {t("voice.transcript")}
      </Text>
      <Text
        style={[
          styles.transcriptText,
          {
            color: colors.textPrimary,
            fontSize: moderateScale(18),
          },
        ]}
      >
        {transcript}
      </Text>
    </View>
  ) : null

  useFocusEffect(
    useCallback(() => {
      reset()

      return () => {
        stopVoiceSearch()
        reset()
      }
    }, [reset, stopVoiceSearch])
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, hasResults ? styles.resultsContent : null]}>
        {hasResults ? (
          <View style={styles.resultsSection}>
            {showRetry || showTranscript ? (
              <View
                style={[
                  styles.resultsHeader,
                  {
                    paddingTop: verticalScale(12),
                    paddingBottom: verticalScale(12),
                  },
                ]}
              >
                {showTranscript ? transcriptContent : null}
                {showRetry ? (
                  <Pressable
                    onPress={startVoiceSearch}
                    style={({ pressed }) => [
                      styles.retryButton,
                      {
                        backgroundColor: pressed ? colors.card : colors.searchBackground,
                        borderColor: colors.border,
                        borderRadius: scale(16),
                        marginTop: showTranscript ? verticalScale(12) : 0,
                        paddingHorizontal: scale(28),
                        paddingVertical: verticalScale(14),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.retryText,
                        {
                          color: colors.textPrimary,
                          fontSize: moderateScale(20),
                        },
                      ]}
                    >
                      {t("voice.retry")}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            <ContactGrid contacts={resultContacts} />
          </View>
        ) : null}

        {!hasResults ? (
          <View style={styles.emptyState}>
            <View style={styles.heroBlock}>
              {showTranscript ? (
                <View style={{ width: "100%", marginBottom: verticalScale(18) }}>
                  {transcriptContent}
                </View>
              ) : null}

              <Text
                style={[
                  styles.statusText,
                  {
                    color: colors.textPrimary,
                    fontSize: moderateScale(32),
                    marginBottom: verticalScale(28),
                  },
                ]}
              >
                {statusText}
              </Text>

              <Pressable
                onPress={handleMicPress}
                style={({ pressed }) => [
                  styles.micCircle,
                  {
                    width: scale(190),
                    height: scale(190),
                    borderRadius: scale(95),
                    backgroundColor: pressed ? colors.primaryPressed : micColor,
                  },
                ]}
                accessibilityLabel={isListening ? t("voice.stop") : t("voice.start")}
                accessibilityRole="button"
              >
                <Ionicons name={iconName} size={moderateScale(82)} color="#FFFFFF" />
              </Pressable>

              {isProcessing ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginTop: verticalScale(22) }}
                />
              ) : null}

              {showRetry ? (
                <Pressable
                  onPress={startVoiceSearch}
                  style={({ pressed }) => [
                    styles.retryButton,
                    {
                      backgroundColor: pressed ? colors.card : colors.searchBackground,
                      borderColor: colors.border,
                      borderRadius: scale(16),
                      marginTop: verticalScale(24),
                      paddingHorizontal: scale(28),
                      paddingVertical: verticalScale(14),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.retryText,
                      {
                        color: colors.textPrimary,
                        fontSize: moderateScale(20),
                      },
                    ]}
                  >
                    {t("voice.retry")}
                  </Text>
                </Pressable>
              ) : null}

              {instructionText ? (
                <Text
                  style={[
                    styles.instructionText,
                    {
                      color: colors.textSecondary,
                      fontSize: moderateScale(20),
                      marginTop: verticalScale(24),
                    },
                  ]}
                >
                  {instructionText}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  retryButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 180,
    borderWidth: 1,
  },
  retryText: {
    fontWeight: "700",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  resultsContent: {
    alignItems: "stretch",
    paddingHorizontal: 0,
  },
  emptyState: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  resultsSection: {
    flex: 1,
    width: "100%",
  },
  resultsHeader: {
    width: "100%",
    alignItems: "center",
  },
  heroBlock: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    maxWidth: 420,
  },
  transcriptBox: {
    width: "100%",
    borderWidth: 1,
    alignItems: "center",
  },
  transcriptLabel: {
    fontWeight: "600",
    textAlign: "center",
  },
  transcriptText: {
    fontWeight: "700",
    textAlign: "center",
  },
  statusText: {
    textAlign: "center",
    fontWeight: "700",
    paddingHorizontal: 24,
  },
  micCircle: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  instructionText: {
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 28,
  },
})
