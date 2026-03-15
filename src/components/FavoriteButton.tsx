import React, { useRef, useCallback, useEffect } from "react"
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

export default React.memo(function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const { moderateScale, scale } = useResponsive()

  const favoriteProgress = useRef(new Animated.Value(isFavorite ? 1 : 0)).current
  const celebrateAnim = useRef(new Animated.Value(0)).current
  const celebrateOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(favoriteProgress, {
      toValue: isFavorite ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start()

    if (!isFavorite) {
      celebrateAnim.setValue(0)
      celebrateOpacity.setValue(0)
    }
  }, [isFavorite, favoriteProgress, celebrateAnim, celebrateOpacity])

  const handlePress = useCallback(() => {
    if (!isFavorite) {
      // Becoming favorite — heart fill + celebrate
      celebrateAnim.setValue(0)
      celebrateOpacity.setValue(1)

      Animated.parallel([
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
    }

    onToggle()
  }, [isFavorite, onToggle, celebrateAnim, celebrateOpacity])

  const filledScale = favoriteProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })
  const filledOpacity = favoriteProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })
  const outlineOpacity = favoriteProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  const iconSize = moderateScale(28)
  const containerSize = scale(50)
  const particleDist = iconSize * 0.9
  const particleSize = scale(5)

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={scale(14)}
      style={[styles.container, { width: containerSize, height: containerSize }]}
    >
      {/* Outline heart */}
      <Animated.View style={[styles.iconWrap, { opacity: outlineOpacity }]}>
        <Ionicons name="heart-outline" size={iconSize} color={HEART_COLOR} />
      </Animated.View>

      {/* Filled heart */}
      <Animated.View
        style={[
          styles.iconWrap,
          { transform: [{ scale: filledScale }], opacity: filledOpacity },
        ]}
      >
        <Ionicons name="heart" size={iconSize} color={HEART_COLOR} />
      </Animated.View>

      {/* Celebrate particles */}
      {PARTICLE_OFFSETS.map((offset, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: containerSize / 2 - particleSize / 2,
              top: containerSize / 2 - particleSize / 2,
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
})

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
    backgroundColor: HEART_COLOR,
  },
})
