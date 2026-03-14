import React, { useEffect, useRef } from "react"
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"
import { useResponsive } from "../theme/responsive"
import { useI18n } from "../i18n"
import ContactCard from "./ContactCard"
import type { VoiceSearchState, Contact } from "../types"

interface VoiceSearchModalProps {
  state: VoiceSearchState
  onStartListening: () => void
  onStopListening: () => void
  onReset: () => void
  onCallMatch: (contact: Contact) => void
}

/** Dinleme sırasında nabız etkisi oluşturan animasyonlu halka */
function PulseRing({
  size,
  color,
  delay,
}: {
  size: number
  color: string
  delay: number
}) {
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [anim, delay])

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.3],
  })
  const opacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  })

  return (
    <Animated.View
      style={[
        styles.waveRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  )
}

function StatusHeader({
  titleColor,
  subtitleColor,
  title,
  subtitle,
}: {
  titleColor: string
  subtitleColor: string
  title: string
  subtitle: string
}) {
  return (
    <View style={styles.statusCard}>
      <Text style={[styles.statusTitle, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.statusSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
    </View>
  )
}

/**
 * Sesli arama ana UI bileşeni.
 * idle / listening / processing / result / error durumlarını render eder.
 */
export default function VoiceSearchModal({
  state,
  onStartListening,
  onStopListening,
  onReset,
  onCallMatch,
}: VoiceSearchModalProps) {
  const colors = useTheme()
  const { scale, verticalScale, moderateScale } = useResponsive()
  const { t } = useI18n()
  const isListening = state.status === "listening"
  const isBusy = state.status === "processing" || state.status === "modelLoading"

  if (state.status === "idle" || isListening || isBusy) {
    const statusConfig =
      state.status === "idle"
        ? {
            title: t("voice.start"),
            subtitle: t("voice.tapToStart"),
            buttonIcon: "mic" as const,
            buttonColor: colors.primary,
            buttonDisabled: false,
            onPress: onStartListening,
          }
        : state.status === "listening"
          ? {
              title: t("voice.listening"),
              subtitle: t("voice.tapToStop"),
              buttonIcon: "stop" as const,
              buttonColor: colors.favoriteActive,
              buttonDisabled: false,
              onPress: onStopListening,
            }
          : state.status === "modelLoading"
            ? {
                title: t("voice.modelLoading"),
                subtitle: t("voice.pleaseWait"),
                buttonIcon: "hourglass-outline" as const,
                buttonColor: colors.border,
                buttonDisabled: true,
                onPress: undefined,
              }
            : {
                title: t("voice.processing"),
                subtitle: t("voice.pleaseWait"),
                buttonIcon: "sync-outline" as const,
                buttonColor: colors.border,
                buttonDisabled: true,
                onPress: undefined,
              }

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <StatusHeader
            titleColor={colors.textPrimary}
            subtitleColor={colors.textSecondary}
            title={statusConfig.title}
            subtitle={statusConfig.subtitle}
          />

          <View style={[styles.waveContainer, { marginTop: verticalScale(40) }]}>
            {isListening && (
              <>
                <PulseRing size={scale(210)} color={colors.favoriteActive} delay={0} />
                <PulseRing size={scale(210)} color={colors.favoriteActive} delay={500} />
                <PulseRing size={scale(210)} color={colors.favoriteActive} delay={1000} />
              </>
            )}
            <Pressable
              disabled={statusConfig.buttonDisabled}
              onPress={statusConfig.onPress}
              style={({ pressed }) => [
                styles.micCircle,
                {
                  width: scale(132),
                  height: scale(132),
                  borderRadius: scale(66),
                  backgroundColor:
                    statusConfig.buttonDisabled
                      ? colors.border
                      : pressed
                        ? state.status === "idle"
                          ? colors.primaryPressed
                          : colors.favoriteActive + "CC"
                        : statusConfig.buttonColor,
                },
              ]}
            >
              {isBusy ? (
                <ActivityIndicator size="large" color={colors.textPrimary} />
              ) : (
                <Ionicons
                  name={statusConfig.buttonIcon}
                  size={moderateScale(50)}
                  color="#FFFFFF"
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    )
  }

  // ── ERROR ──
  if (state.status === "error") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <View
            style={[
              styles.iconCircle,
              {
                width: scale(80),
                height: scale(80),
                borderRadius: scale(40),
                backgroundColor: colors.favoriteActive + "15",
              },
            ]}
          >
            <Ionicons
              name="alert-circle"
              size={moderateScale(48)}
              color={colors.favoriteActive}
            />
          </View>
          <Text
            style={[
              styles.statusText,
              {
                color: colors.textPrimary,
                fontSize: moderateScale(16),
                marginTop: verticalScale(20),
                paddingHorizontal: scale(32),
              },
            ]}
          >
            {state.error ?? t("voice.errorMessage")}
          </Text>
          <Pressable
            onPress={onReset}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: pressed ? colors.primaryPressed : colors.primary,
                paddingHorizontal: scale(40),
                paddingVertical: verticalScale(14),
                borderRadius: scale(12),
                marginTop: verticalScale(28),
              },
            ]}
          >
            <Ionicons
              name="refresh"
              size={moderateScale(18)}
              color="#FFFFFF"
              style={{ marginRight: scale(6) }}
            />
            <Text style={[styles.buttonText, { fontSize: moderateScale(16) }]}>
              {t("voice.retry")}
            </Text>
          </Pressable>
        </View>
      </View>
    )
  }

  // ── RESULT ──
  const { matches, transcript } = state

  // Sonuç yok veya düşük güven
  if (matches.length === 0 || matches[0].confidence === "low") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <View
            style={[
              styles.iconCircle,
              {
                width: scale(80),
                height: scale(80),
                borderRadius: scale(40),
                backgroundColor: colors.textDisabled + "20",
              },
            ]}
          >
            <Ionicons
              name="search"
              size={moderateScale(40)}
              color={colors.textDisabled}
            />
          </View>
          {transcript.length > 0 && (
            <Text
              style={[
                styles.transcriptText,
                {
                  color: colors.textDisabled,
                  fontSize: moderateScale(13),
                  marginTop: verticalScale(16),
                },
              ]}
            >
              {t("voice.transcript")}: "{transcript}"
            </Text>
          )}
          <Text
            style={[
              styles.statusText,
              {
                color: colors.textSecondary,
                fontSize: moderateScale(16),
                marginTop: verticalScale(12),
                paddingHorizontal: scale(32),
              },
            ]}
          >
            {t("voice.notFound")}
          </Text>
          <Pressable
            onPress={onReset}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: pressed ? colors.primaryPressed : colors.primary,
                paddingHorizontal: scale(40),
                paddingVertical: verticalScale(14),
                borderRadius: scale(12),
                marginTop: verticalScale(28),
              },
            ]}
          >
            <Ionicons
              name="refresh"
              size={moderateScale(18)}
              color="#FFFFFF"
              style={{ marginRight: scale(6) }}
            />
            <Text style={[styles.buttonText, { fontSize: moderateScale(16) }]}>
              {t("voice.retry")}
            </Text>
          </Pressable>
        </View>
      </View>
    )
  }

  // Tek eşleşme (high/medium confidence)
  if (matches.length === 1) {
    const match = matches[0]
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: scale(16),
            paddingTop: verticalScale(24),
            paddingBottom: verticalScale(32),
          }}
        >
          {transcript.length > 0 && (
            <Text
              style={[
                styles.transcriptText,
                {
                  color: colors.textDisabled,
                  fontSize: moderateScale(13),
                  marginBottom: verticalScale(20),
                },
              ]}
            >
              {t("voice.transcript")}: "{transcript}"
            </Text>
          )}
          <ContactCard
            contact={match.contact}
            onCall={onCallMatch}
            showFavoriteButton={false}
          />
          <Pressable
            onPress={onReset}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: pressed ? colors.border : colors.card,
                paddingHorizontal: scale(24),
                paddingVertical: verticalScale(14),
                borderRadius: scale(12),
                borderWidth: 1,
                borderColor: colors.border,
                marginTop: verticalScale(12),
                alignSelf: "center",
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { fontSize: moderateScale(16), color: colors.textPrimary },
              ]}
            >
              {t("voice.retry")}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    )
  }

  // Çoklu aday
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.candidatesScroll}
        contentContainerStyle={{
          paddingHorizontal: scale(16),
          paddingBottom: verticalScale(24),
        }}
      >
        {transcript.length > 0 && (
          <Text
            style={[
              styles.transcriptText,
              {
                color: colors.textDisabled,
                fontSize: moderateScale(13),
                marginTop: verticalScale(20),
                textAlign: "center",
              },
            ]}
          >
            {t("voice.transcript")}: "{transcript}"
          </Text>
        )}
        <Text
          style={[
            styles.candidatesTitle,
            {
              color: colors.textPrimary,
              fontSize: moderateScale(18),
              marginBottom: verticalScale(16),
              marginTop: verticalScale(16),
            },
          ]}
        >
          {t("voice.candidates")}
        </Text>
        {matches.map((match) => (
          <ContactCard
            key={match.contact.id}
            contact={match.contact}
            onCall={onCallMatch}
            showFavoriteButton={false}
          />
        ))}
        <Pressable
          onPress={onReset}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: pressed ? colors.border : colors.card,
              paddingHorizontal: scale(24),
              paddingVertical: verticalScale(14),
              borderRadius: scale(12),
              marginTop: verticalScale(12),
              alignSelf: "center",
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { fontSize: moderateScale(16), color: colors.textPrimary },
            ]}
          >
            {t("voice.retry")}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  micHint: {
    alignItems: "center",
  },
  statusCard: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statusTitle: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 24,
    marginTop: 12,
  },
  statusSubtitle: {
    textAlign: "center",
    lineHeight: 21,
    fontSize: 14,
    marginTop: 6,
    maxWidth: 280,
  },
  hintText: {
    textAlign: "center",
    lineHeight: 22,
  },
  hintSubText: {
    textAlign: "center",
  },
  micCircle: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  waveContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  waveRing: {
    position: "absolute",
    borderWidth: 3,
  },
  statusText: {
    textAlign: "center",
  },
  transcriptText: {
    textAlign: "center",
    fontStyle: "italic",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  candidatesScroll: {
    flex: 1,
  },
  candidatesTitle: {
    fontWeight: "700",
    textAlign: "center",
  },
})
