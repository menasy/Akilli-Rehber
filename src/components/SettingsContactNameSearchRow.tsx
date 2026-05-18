import React from "react"
import { View, Text, StyleSheet, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type SettingsContactNameSearchRowProps = {
  colors: any
  t: (key: string) => string
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
  contactNameSearch: boolean
  setContactNameSearch: (enabled: boolean) => void
}

export default function SettingsContactNameSearchRow({
  colors,
  t,
  scale,
  verticalScale,
  moderateScale,
  contactNameSearch,
  setContactNameSearch,
}: SettingsContactNameSearchRowProps) {
  return (
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
        <Ionicons name="search" size={moderateScale(28)} color={colors.primary} />
        <View style={{ marginLeft: scale(14), flexShrink: 1 }}>
          <Text
            style={[
              styles.rowLabel,
              {
                color: colors.textPrimary,
                fontSize: moderateScale(20),
              },
            ]}
          >
            {t("settings.contactNameSearch.title")}
          </Text>
          <Text
            style={[
              styles.rowDesc,
              {
                color: colors.textSecondary,
                fontSize: moderateScale(13),
                marginTop: verticalScale(4),
              },
            ]}
          >
            {t("settings.contactNameSearch.description")}
          </Text>
        </View>
      </View>
      <Switch
        style={{ transform: [{ scale: 1.3 }] }}
        value={contactNameSearch}
        onValueChange={setContactNameSearch}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={"#FFFFFF"}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 16,
  },
  rowLabel: {
    fontWeight: "600",
  },
  rowDesc: {
    fontWeight: "400",
  },
})
