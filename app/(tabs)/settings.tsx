import React from "react"
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import { useResponsive } from "../../src/theme/responsive"
import { useSettingsStore } from "../../src/store/settingsStore"
import { Ionicons } from "@expo/vector-icons"
import ThemeSwitch from "../../src/components/ThemeSwitch"
import { ContactSize } from "../../src/types"

const SIZES: ContactSize[] = ["small", "medium", "large"]

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
      {/* Theme */}
      <View
        style={[
          styles.row,
          {
            backgroundColor: colors.card,
            borderRadius: scale(16),
            marginHorizontal: scale(14),
            marginTop: verticalScale(16),
            padding: scale(20),
            minHeight: verticalScale(72),
          },
        ]}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            name={theme === "dark" ? "moon" : "sunny"}
            size={moderateScale(28)}
            color={colors.primary}
          />
          <Text
            style={[
              styles.rowLabel,
              {
                color: colors.textPrimary,
                fontSize: moderateScale(20),
                marginLeft: scale(14),
              },
            ]}
          >
            {t("settings.theme")}
          </Text>
        </View>
        <ThemeSwitch isDark={theme === "dark"} onToggle={toggleTheme} />
      </View>

      {/* Language */}
      <View
        style={[
          styles.row,
          {
            backgroundColor: colors.card,
            borderRadius: scale(16),
            marginHorizontal: scale(14),
            marginTop: verticalScale(14),
            padding: scale(20),
            minHeight: verticalScale(72),
          },
        ]}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            name="language"
            size={moderateScale(28)}
            color={colors.primary}
          />
          <Text
            style={[
              styles.rowLabel,
              {
                color: colors.textPrimary,
                fontSize: moderateScale(20),
                marginLeft: scale(14),
              },
            ]}
          >
            {t("settings.language")}
          </Text>
        </View>
        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLanguage("tr")}
            style={[
              styles.chip,
              {
                backgroundColor: language === "tr" ? colors.primary : colors.tabBarItemBg,
                borderRadius: scale(10),
                paddingVertical: verticalScale(10),
                paddingHorizontal: scale(18),
                marginRight: scale(8),
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  fontSize: moderateScale(17),
                  color: language === "tr" ? "#FFFFFF" : colors.textSecondary,
                },
              ]}
            >
              Türkçe
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLanguage("ku")}
            style={[
              styles.chip,
              {
                backgroundColor: language === "ku" ? colors.primary : colors.tabBarItemBg,
                borderRadius: scale(10),
                paddingVertical: verticalScale(10),
                paddingHorizontal: scale(18),
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  fontSize: moderateScale(17),
                  color: language === "ku" ? "#FFFFFF" : colors.textSecondary,
                },
              ]}
            >
              Kurdî
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Contact Size */}
      <View
        style={[
          styles.sizeCard,
          {
            backgroundColor: colors.card,
            borderRadius: scale(16),
            marginHorizontal: scale(14),
            marginTop: verticalScale(14),
            padding: scale(20),
          },
        ]}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            name="resize"
            size={moderateScale(28)}
            color={colors.primary}
          />
          <Text
            style={[
              styles.rowLabel,
              {
                color: colors.textPrimary,
                fontSize: moderateScale(20),
                marginLeft: scale(14),
              },
            ]}
          >
            {t("settings.contactSize")}
          </Text>
        </View>
        <View
          style={[
            styles.sizeRow,
            { marginTop: verticalScale(14), gap: scale(8) },
          ]}
        >
          {SIZES.map((size) => (
            <Pressable
              key={size}
              onPress={() => setContactSize(size)}
              style={[
                styles.sizeChip,
                {
                  backgroundColor:
                    contactSize === size ? colors.primary : colors.tabBarItemBg,
                  borderRadius: scale(10),
                  paddingVertical: verticalScale(12),
                  flex: 1,
                },
              ]}
            >
              <Ionicons
                name={
                  size === "small"
                    ? "person-outline"
                    : size === "medium"
                    ? "person"
                    : "people"
                }
                size={moderateScale(size === "small" ? 20 : size === "medium" ? 24 : 28)}
                color={contactSize === size ? "#FFFFFF" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.chipText,
                  {
                    fontSize: moderateScale(15),
                    color: contactSize === size ? "#FFFFFF" : colors.textSecondary,
                    marginTop: verticalScale(4),
                  },
                ]}
              >
                {t(`settings.${size}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  rowLabel: {
    fontWeight: "600",
  },
  langRow: {
    flexDirection: "row",
  },
  sizeCard: {},
  sizeRow: {
    flexDirection: "row",
  },
  sizeChip: {
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontWeight: "600",
  },
})
