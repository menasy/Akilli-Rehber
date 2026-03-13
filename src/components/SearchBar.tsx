import React from "react"
import { View, TextInput, StyleSheet, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"
import { useResponsive } from "../theme/responsive"
import { useI18n } from "../i18n"

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  const colors = useTheme()
  const { scale, verticalScale, moderateScale } = useResponsive()
  const { t } = useI18n()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.searchBackground,
          borderRadius: scale(14),
          marginHorizontal: scale(12),
          marginTop: verticalScale(10),
          marginBottom: verticalScale(6),
          paddingHorizontal: scale(14),
          height: verticalScale(52),
        },
      ]}
    >
      <Ionicons
        name="search"
        size={moderateScale(22)}
        color={colors.searchIcon}
        style={{ marginRight: scale(10) }}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: colors.searchText,
            fontSize: moderateScale(18),
          },
        ]}
        placeholder={t("search.placeholder")}
        placeholderTextColor={colors.searchIcon}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={12}>
          <Ionicons
            name="close-circle"
            size={moderateScale(22)}
            color={colors.searchIcon}
          />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 0,
    fontWeight: "500",
  },
})