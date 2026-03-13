import React, { useRef, useCallback } from "react"
import { Pressable, Animated, View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../theme/responsive"

const HEART_COLOR = "rgb(255, 91, 137)"

const PARTICLE_OFFSETS = [
  { x: -1, y: -1 },
  { x: -1.2, y: 0 },
  { x: -0.7, y: 1 },
  { x: 1, y: -1 },
  { x: 1.2, y: 0 },
  { x: 0.7, y: 1 },
]

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
}

export default function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const { moderateScale, scale } = useResponsive()

  const filledScale = useRef(new Animated.Value(isFavorite ? 1 : 0)).current
  const outlineOpacity = useRef(new Animated.Value(isFavorite ? 0 : 1)).current
  const celebrateAnim = useRef(new Animated.Value(0)).current
  const celebrateOpacity = useRef(new Animated.Value(0)).current

  const handlePress = useCallback(() => {
    if (!isFavorite) {
      // Becoming favorite — heart fill + celebrate
      filledScale.setValue(0)
      outlineOpacity.setValue(0)
      celebrateAnim.setValue(0)
      celebrateOpacity.setValue(1)

      Animated.parallel([
        Animated.sequence([
          Animated.timing(filledScale, {
            toValue: 1.2,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(filledScale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(celebrateAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(celebrateOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start()
    } else {
      // Removing favorite — heart shrink
      Animated.sequence([
        Animated.timing(filledScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(outlineOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }

    onToggle()
  }, [isFavorite, onToggle, filledScale, outlineOpacity, celebrateAnim, celebrateOpacity])

  const iconSize = moderateScale(28)
  const containerSize = scale(50)
  const particleDist = iconSize * 0.9

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={14}
      style={[styles.container, { width: containerSize, height: containerSize }]}
    >
      {/* Outline heart */}
      <Animated.View style={[styles.iconWrap, { opacity: outlineOpacity }]}>
        <Ionicons name="heart-outline" size={iconSize} color={HEART_COLOR} />
      </Animated.View>

      {/* Filled heart */}
      <Animated.View style={[styles.iconWrap, { transform: [{ scale: filledScale }] }]}>
        <Ionicons name="heart" size={iconSize} color={HEART_COLOR} />
      </Animated.View>

      {/* Celebrate particles */}
      {PARTICLE_OFFSETS.map((offset, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: containerSize / 2 - 2.5,
              top: containerSize / 2 - 2.5,
              opacity: celebrateOpacity,
              transform: [
                {
                  translateX: celebrateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, offset.x * particleDist],
                  }),
                },
                {
                  translateY: celebrateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, offset.y * particleDist],
                  }),
                },
                {
                  scale: celebrateAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.2, 0.4],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    position: "absolute",
  },
  particle: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: HEART_COLOR,
  },
})