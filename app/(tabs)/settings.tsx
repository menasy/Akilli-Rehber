import React from "react"
import { StyleSheet, ScrollView, Text, Pressable, Linking, View } from "react-native"
import Constants from "expo-constants"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import { useResponsive } from "../../src/theme/responsive"
import { useSettingsStore } from "../../src/store/settingsStore"
import SettingsThemeRow from "../../src/components/SettingsThemeRow"
import SettingsLanguageRow from "../../src/components/SettingsLanguageRow"
import SettingsContactSizeRow from "../../src/components/SettingsContactSizeRow"
import SettingsDefaultScreenRow from "../../src/components/SettingsDefaultScreenRow"
import SettingsContactsSyncRow from "../../src/components/SettingsContactsSyncRow"

export default function Settings() {
  const colors = useTheme()
  const { t } = useI18n()
  const { scale, verticalScale, moderateScale } = useResponsive()
  const appVersion = Constants.expoConfig?.version ?? "1.0.0"
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    contactSize,
    setContactSize,
    defaultScreen,
    setDefaultScreen,
  } = useSettingsStore()

  const handleOpenUrl = (url: string) => {
    void Linking.openURL(url)
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: verticalScale(32) }}
    >
      <SettingsThemeRow
        colors={colors}
        t={t}
        scale={scale}
        verticalScale={verticalScale}
        moderateScale={moderateScale}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <SettingsLanguageRow
        colors={colors}
        t={t}
        scale={scale}
        verticalScale={verticalScale}
        moderateScale={moderateScale}
        language={language}
        setLanguage={setLanguage}
      />
      <SettingsContactSizeRow
        colors={colors}
        t={t}
        scale={scale}
        verticalScale={verticalScale}
        moderateScale={moderateScale}
        contactSize={contactSize}
        setContactSize={setContactSize}
      />
      <SettingsContactsSyncRow
        colors={colors}
        t={t}
        scale={scale}
        verticalScale={verticalScale}
        moderateScale={moderateScale}
      />
      <SettingsDefaultScreenRow
        colors={colors}
        t={t}
        scale={scale}
        verticalScale={verticalScale}
        moderateScale={moderateScale}
        defaultScreen={defaultScreen}
        setDefaultScreen={setDefaultScreen}
      />
      <View
        style={[
          styles.aboutCard,
          {
            backgroundColor: colors.card,
            borderRadius: scale(16),
            marginHorizontal: scale(14),
            marginTop: verticalScale(18),
            paddingVertical: verticalScale(18),
            paddingHorizontal: scale(20),
          },
        ]}
      >
        <Text
          style={[
            styles.aboutTitle,
            {
              color: colors.textPrimary,
              fontSize: moderateScale(18),
            },
          ]}
        >
          {t("settings.about")}
        </Text>

        <View style={{ marginTop: verticalScale(12), gap: verticalScale(12) }}>
          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: colors.textSecondary, fontSize: moderateScale(14) },
              ]}
            >
              {t("settings.appVersion")}
            </Text>
            <Text
              style={[
                styles.infoValue,
                { color: colors.textPrimary, fontSize: moderateScale(14) },
              ]}
            >
              {appVersion}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: colors.textSecondary, fontSize: moderateScale(14) },
              ]}
            >
              {t("settings.developer")}
            </Text>
            <Text
              style={[
                styles.infoValue,
                { color: colors.textPrimary, fontSize: moderateScale(14) },
              ]}
            >
              Menasy
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: colors.textSecondary, fontSize: moderateScale(14) },
              ]}
            >
              {t("settings.website")}
            </Text>
            <Pressable onPress={() => handleOpenUrl("https://menasy.me")}>
              <Text
                style={[
                  styles.infoLink,
                  { color: colors.primary, fontSize: moderateScale(14) },
                ]}
              >
                menasy.me
              </Text>
            </Pressable>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                { color: colors.textSecondary, fontSize: moderateScale(14) },
              ]}
            >
              {t("settings.github")}
            </Text>
            <Pressable onPress={() => handleOpenUrl("https://github.com/menasy")}>
              <Text
                style={[
                  styles.infoLink,
                  { color: colors.primary, fontSize: moderateScale(14) },
                ]}
              >
                github.com/menasy
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aboutCard: {
    justifyContent: "center",
  },
  aboutTitle: {
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLabel: {
    fontWeight: "500",
  },
  infoValue: {
    fontWeight: "600",
  },
  infoLink: {
    fontWeight: "700",
  },
})
