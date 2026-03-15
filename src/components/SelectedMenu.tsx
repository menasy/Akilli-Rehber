import React, { useRef, useEffect } from "react"
import { Pressable, Text, Animated, StyleSheet, Platform, ViewStyle, TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type SelectedMenuProps = {
  isSelected: boolean
  iconName?: string
  label: string
  onPress: () => void
  onLongPress?: () => void
  colors: any
  scale: (n: number) => number
  verticalScale: (n: number) => number
  moderateScale: (n: number, f?: number) => number
  iconSize?: number
  labelSize?: number
  activeBgColor?: string
  inactiveBgColor?: string
  activeTextColor?: string
  inactiveTextColor?: string
  pressableStyle?: ViewStyle
  innerStyle?: ViewStyle
  labelStyle?: TextStyle
}

export default function SelectedMenu({
  isSelected,
  iconName,
  label,
  onPress,
  onLongPress,
  colors,
  scale,
  verticalScale,
  moderateScale,
  iconSize,
  labelSize,
  activeBgColor,
  inactiveBgColor,
  activeTextColor,
  inactiveTextColor,
  pressableStyle,
  innerStyle,
  labelStyle,
}: SelectedMenuProps) {
  const animValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      animValue.setValue(0)
    }
  }, [isSelected, animValue])

  const scaleAnim = animValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 1.08, 1],
  })

  const translateY = animValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, -2, 2],
  })

  const resolvedIconSize = iconSize ?? moderateScale(20)
  const resolvedLabelSize = labelSize ?? moderateScale(10)
  const resolvedActiveBg = activeBgColor ?? colors.primary
  const resolvedInactiveBg = inactiveBgColor ?? colors.tabBarItemBg
  const resolvedActiveText = activeTextColor ?? colors.tabBarActiveText
  const resolvedInactiveText = inactiveTextColor ?? colors.tabBarInactiveText

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.pressable, pressableStyle]}
    >
      <Animated.View
        style={[
          styles.inner,
          {
            borderRadius: scale(12),
            paddingVertical: verticalScale(8),
            paddingHorizontal: scale(4),
            backgroundColor: isSelected ? resolvedActiveBg : resolvedInactiveBg,
            transform: [{ scale: scaleAnim }, { translateY }],
            ...Platform.select({
              ios: {
                shadowColor: isSelected ? resolvedActiveBg : "#000",
                shadowOffset: isSelected
                  ? { width: 0, height: verticalScale(3) }
                  : { width: scale(3), height: verticalScale(3) },
                shadowOpacity: isSelected ? 0.3 : 0.1,
                shadowRadius: isSelected ? scale(8) : scale(6),
              },
              android: {
                elevation: isSelected ? 6 : 3,
              },
            }),
          },
          innerStyle,
        ]}
      >
        {iconName ? (
          <Ionicons
            name={iconName as any}
            size={resolvedIconSize}
            color={isSelected ? resolvedActiveText : resolvedInactiveText}
          />
        ) : null}
        <Text
          style={[
            styles.label,
            {
              fontSize: resolvedLabelSize,
              color: isSelected ? resolvedActiveText : resolvedInactiveText,
              fontWeight: isSelected ? "700" : "500",
              marginTop: verticalScale(2),
            },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "System",
  },
})
