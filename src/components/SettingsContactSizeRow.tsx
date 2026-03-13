import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, InteractionManager } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SelectedMenu from "./SelectedMenu"
import { ContactSize } from "../types"

const SIZES: ContactSize[] = ["small", "medium", "large"]

type SettingsContactSizeRowProps = {
  colors: any
  t: (key: string) => string
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
  contactSize: ContactSize
  setContactSize: (size: ContactSize) => void
}

export default function SettingsContactSizeRow({
  colors,
  t,
  scale,
  verticalScale,
  moderateScale,
  contactSize,
  setContactSize,
}: SettingsContactSizeRowProps) {
  const [uiSize, setUiSize] = useState<ContactSize>(contactSize)

  useEffect(() => {
    setUiSize(contactSize)
  }, [contactSize])

  const handleSelect = (size: ContactSize) => {
    setUiSize(size)
    InteractionManager.runAfterInteractions(() => setContactSize(size))
  }

  return (
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
        <Ionicons name="resize" size={moderateScale(28)} color={colors.primary} />
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
        {SIZES.map((size) => {
          const iconName =
            size === "small"
              ? "person-outline"
              : size === "medium"
              ? "person"
              : "people"
          const iconSize = moderateScale(size === "small" ? 20 : size === "medium" ? 24 : 28)

          return (
            <SelectedMenu
              key={size}
              isSelected={uiSize === size}
              iconName={iconName}
              label={t(`settings.${size}`)}
              onPress={() => handleSelect(size)}
              colors={colors}
              scale={scale}
              verticalScale={verticalScale}
              moderateScale={moderateScale}
              iconSize={iconSize}
              labelSize={moderateScale(15)}
              activeTextColor="#FFFFFF"
              inactiveTextColor={colors.textSecondary}
              activeBgColor={colors.primary}
              inactiveBgColor={colors.tabBarItemBg}
              pressableStyle={styles.sizeChip}
              innerStyle={{
                borderRadius: scale(10),
                paddingVertical: verticalScale(12),
              }}
              labelStyle={{ marginTop: verticalScale(4) }}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sizeCard: {},
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  rowLabel: {
    fontWeight: "600",
  },
  sizeRow: {
    flexDirection: "row",
  },
  sizeChip: {
    flex: 1,
  },
})
