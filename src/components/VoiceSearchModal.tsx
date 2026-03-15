import React from "react"
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"
import { useResponsive } from "../theme/responsive"
import { useI18n } from "../i18n"
import { useVoiceSearch } from "../hooks/useVoiceSearch"
import ContactCard from "./ContactCard"

interface VoiceSearchModalProps {
  visible: boolean
  onClose: () => void
}

export default function VoiceSearchModal({ visible, onClose }: VoiceSearchModalProps) {
  const colors = useTheme()
  const { scale, verticalScale, moderateScale } = useResponsive()
  const { t } = useI18n()
  const {
    isListening,
    isProcessing,
    matches,
    error,
    showResults,
    startVoiceSearch,
    stopVoiceSearch,
    selectContact,
    reset,
  } = useVoiceSearch()

  const handleClose = () => {
    stopVoiceSearch()
    reset()
    onClose()
  }

  const handleRetry = () => {
    startVoiceSearch()
  }

  const statusIconName = error
    ? "alert-circle"
    : isListening
      ? "mic"
      : isProcessing || showResults
        ? "checkmark-circle"
        : "mic-outline"

  const statusIconColor = error
    ? colors.favoriteActive
    : isListening
      ? colors.favoriteActive
      : isProcessing || showResults
        ? colors.primary
        : colors.textDisabled

  const primaryText = error
    ? t(error)
    : isListening
      ? t("voice.listening")
      : isProcessing
        ? t("voice.processing")
        : showResults && matches.length > 0
          ? t("voice.candidates")
          : t("voice.pressToTalk")

  const secondaryText = error
    ? t("voice.retry")
    : isListening
      ? t("voice.tapToStop")
      : isProcessing
        ? t("voice.pleaseWait")
        : showResults && matches.length > 0
          ? t("voice.candidates")
          : t("voice.tapToStart")

  const helperText = error
    ? null
    : isListening
      ? t("voice.stop")
      : isProcessing
        ? t("voice.processingHint")
        : showResults && matches.length > 0
          ? null
          : t("voice.examplePrompt")
  const showExamplePrompt = !error && !isListening && !isProcessing && !showResults

  const renderContent = () => {
    const showStatusSpinner = isProcessing && !error

    if (showResults && matches.length > 0) {
      return (
        <View style={styles.resultsContent}>
          <FlatList
            ListHeaderComponent={
              <View style={[styles.statusCard, {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: scale(18),
                marginBottom: verticalScale(16),
                paddingHorizontal: scale(18),
                paddingVertical: verticalScale(20),
              }]}>
                <View style={styles.statusIconWrap}>
                  <Ionicons
                    name={statusIconName}
                    size={moderateScale(40)}
                    color={statusIconColor}
                  />
                  {showStatusSpinner ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary}
                      style={styles.statusSpinner}
                    />
                  ) : null}
                </View>
                <Text style={[styles.statusText, {
                  color: colors.textPrimary,
                  fontSize: moderateScale(18),
                  marginTop: verticalScale(14),
                }]}>
                  {primaryText}
                </Text>
                <Text style={[styles.supportingText, {
                  color: colors.textSecondary,
                  fontSize: moderateScale(14),
                  marginTop: verticalScale(8),
                }]}>
                  {secondaryText}
                </Text>
                {helperText ? (
                  showExamplePrompt ? (
                    <View style={[styles.helperRow, { marginTop: verticalScale(10) }]}>
                      <Ionicons
                        name="information-circle-outline"
                        size={moderateScale(16)}
                        color={colors.textSecondary}
                      />
                      <Text style={[styles.helperText, styles.helperInfoText, {
                        color: colors.textPrimary,
                        fontSize: moderateScale(13),
                      }]}>
                        {helperText}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.helperText, {
                      color: colors.textPrimary,
                      fontSize: moderateScale(13),
                      marginTop: verticalScale(10),
                    }]}>
                      {helperText}
                    </Text>
                  )
                ) : null}
              </View>
            }
            data={matches}
            keyExtractor={(item) => item.contact.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => selectContact(item.contact)}>
                <ContactCard contact={item.contact} />
              </Pressable>
            )}
            contentContainerStyle={{
              paddingHorizontal: scale(12),
              paddingBottom: verticalScale(20),
            }}
          />
        </View>
      )
    }

    return (
      <View style={styles.centerContent}>
        <View style={[styles.statusCard, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: scale(18),
          paddingHorizontal: scale(24),
          paddingVertical: verticalScale(24),
          width: "100%",
        }]}>
          <View style={styles.statusIconWrap}>
            <Ionicons
              name={statusIconName}
              size={moderateScale(56)}
              color={statusIconColor}
            />
            {showStatusSpinner ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.statusSpinner}
              />
            ) : null}
          </View>
          <Text style={[styles.statusText, {
            color: error ? colors.favoriteActive : colors.textPrimary,
            fontSize: moderateScale(18),
            marginTop: verticalScale(18),
          }]}>
            {primaryText}
          </Text>
          <Text style={[styles.supportingText, {
            color: colors.textSecondary,
            fontSize: moderateScale(14),
            marginTop: verticalScale(8),
          }]}>
            {secondaryText}
          </Text>
          {helperText ? (
            showExamplePrompt ? (
              <View style={[styles.helperRow, { marginTop: verticalScale(12) }]}>
                <Ionicons
                  name="information-circle-outline"
                  size={moderateScale(16)}
                  color={colors.textSecondary}
                />
                <Text style={[styles.helperText, styles.helperInfoText, {
                  color: colors.textPrimary,
                  fontSize: moderateScale(13),
                }]}>
                  {helperText}
                </Text>
              </View>
            ) : (
              <Text style={[styles.helperText, {
                color: colors.textPrimary,
                fontSize: moderateScale(13),
                marginTop: verticalScale(12),
              }]}>
                {helperText}
              </Text>
            )
          ) : null}

          {error ? (
            <Pressable
              onPress={handleRetry}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: pressed ? colors.primaryPressed : colors.primary,
                  borderRadius: scale(12),
                  paddingVertical: verticalScale(12),
                  marginTop: verticalScale(20),
                },
              ]}
            >
              <Text style={[styles.primaryButtonText, { fontSize: moderateScale(15) }]}>
                {t("voice.retry")}
              </Text>
            </Pressable>
          ) : null}

          {isListening ? (
            <Pressable
              onPress={stopVoiceSearch}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: pressed ? colors.primaryPressed : colors.primary,
                  borderRadius: scale(12),
                  paddingVertical: verticalScale(12),
                  marginTop: verticalScale(20),
                },
              ]}
            >
              <Text style={[styles.primaryButtonText, { fontSize: moderateScale(15) }]}>
                {t("voice.stop")}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingHorizontal: scale(16),
              paddingTop: verticalScale(50),
              paddingBottom: verticalScale(12),
            },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              { color: colors.textPrimary, fontSize: moderateScale(20) },
            ]}
          >
            {t("voice.title")}
          </Text>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Ionicons name="close" size={moderateScale(28)} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.body}>{renderContent()}</View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "700",
  },
  body: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  resultsContent: {
    flex: 1,
    paddingTop: 8,
  },
  statusText: {
    fontWeight: "600",
    textAlign: "center",
  },
  supportingText: {
    textAlign: "center",
    lineHeight: 20,
  },
  helperText: {
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 19,
  },
  helperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    maxWidth: "90%",
    gap: 6,
  },
  helperInfoText: {
    flexShrink: 1,
    textAlign: "left",
  },
  statusCard: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusSpinner: {
    marginTop: 10,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  retryButton: {
    alignItems: "center",
    justifyContent: "center",
  },
})
