import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SelectedMenu from "./SelectedMenu"
import { CommunicationMethod } from "../types"

const METHODS: { key: CommunicationMethod; icon: string; labelKey: string }[] = [
  { key: "phone", icon: "call-outline", labelKey: "settings.communicationMethod.phone" },
  { key: "whatsapp", icon: "logo-whatsapp", labelKey: "settings.communicationMethod.whatsapp" },
  { key: "both", icon: "layers-outline", labelKey: "settings.communicationMethod.both" },
]

type SettingsCommunicationMethodRowProps = {
  colors: any
  t: (key: string) => string
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
  communicationMethod: CommunicationMethod
  setCommunicationMethod: (method: CommunicationMethod) => void
}

export default function SettingsCommunicationMethodRow({
  colors,
  t,
  scale,
  verticalScale,
  moderateScale,
  communicationMethod,
  setCommunicationMethod,
}: SettingsCommunicationMethodRowProps) {
  return (
    <View
      style={[
        styles.card,
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
        <Ionicons name="call-outline" size={moderateScale(28)} color={colors.primary} />
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
          {t("settings.communicationMethod.title")}
        </Text>
      </View>

      <Text
        style={[
          styles.description,
          {
            color: colors.textSecondary,
            fontSize: moderateScale(14),
            marginTop: verticalScale(8),
          },
        ]}
      >
        {t("settings.communicationMethod.description")}
      </Text>

      <View
        style={[
          styles.screenRow,
          { marginTop: verticalScale(14), gap: scale(8) },
        ]}
      >
        {METHODS.map((method) => (
          <SelectedMenu
            key={method.key}
            isSelected={communicationMethod === method.key}
            iconName={method.icon}
            label={t(method.labelKey)}
            onPress={() => setCommunicationMethod(method.key)}
            colors={colors}
            scale={scale}
            verticalScale={verticalScale}
            moderateScale={moderateScale}
            iconSize={moderateScale(22)}
            labelSize={moderateScale(11)}
            activeTextColor="#FFFFFF"
            inactiveTextColor={colors.textSecondary}
            activeBgColor={method.key === "whatsapp" ? "#25D366" : colors.primary}
            inactiveBgColor={colors.tabBarItemBg}
            pressableStyle={styles.screenChip}
            innerStyle={{
              borderRadius: scale(10),
              paddingVertical: verticalScale(12),
            }}
            labelStyle={{ marginTop: verticalScale(4) }}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {},
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  rowLabel: {
    fontWeight: "600",
  },
  description: {
    fontWeight: "400",
  },
  screenRow: {
    flexDirection: "row",
  },
  screenChip: {
    flex: 1,
  },
})
