import React from "react"
import { StyleSheet, ScrollView } from "react-native"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import { useResponsive } from "../../src/theme/responsive"
import { useSettingsStore } from "../../src/store/settingsStore"
import SettingsThemeRow from "../../src/components/SettingsThemeRow"
import SettingsLanguageRow from "../../src/components/SettingsLanguageRow"
import SettingsContactSizeRow from "../../src/components/SettingsContactSizeRow"

export default function Settings() {
  const colors = useTheme()
  const { t } = useI18n()
  const { scale, verticalScale, moderateScale } = useResponsive()
  const { theme, toggleTheme, language, setLanguage, contactSize, setContactSize } =
    useSettingsStore()

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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
