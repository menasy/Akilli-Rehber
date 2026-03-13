import React, { useRef, useEffect } from "react"
import { View, Pressable, Animated, StyleSheet } from "react-native"
import { useResponsive } from "../theme/responsive"

const SKY_BG = "#3D7EAE"
const NIGHT_BG = "#1D1F2C"
const SUN_COLOR = "#ECCA2F"
const MOON_COLOR = "#C4C9D1"
const SPOT_COLOR = "#959DB1"
const CLOUD_COLOR = "#F3FDFF"
const CLOUD_BACK = "#AACADF"
const STAR_COLOR = "#FFFFFF"

interface ThemeSwitchProps {
  isDark: boolean
  onToggle: () => void
}

export default function ThemeSwitch({ isDark, onToggle }: ThemeSwitchProps) {
  const { scale: s } = useResponsive()
  const anim = useRef(new Animated.Value(isDark ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [isDark, anim])

  const W = s(100)
  const H = s(44)
  const CIRCLE = s(34)
  const PAD = (H - CIRCLE) / 2

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SKY_BG, NIGHT_BG],
  })

  const circleX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PAD, W - CIRCLE - PAD],
  })

  const circleBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SUN_COLOR, MOON_COLOR],
  })

  const moonOpacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  })

  const cloudBottom = anim.interpolate({
    inputRange: [0, 0.4],
    outputRange: [s(-2), s(-50)],
    extrapolate: "clamp",
  })

  const starsOpacity = anim.interpolate({
    inputRange: [0.6, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  const STAR_POSITIONS = [
    { top: H * 0.18, left: W * 0.48, size: 3 },
    { top: H * 0.5, left: W * 0.58, size: 2 },
    { top: H * 0.28, left: W * 0.72, size: 2.5 },
    { top: H * 0.62, left: W * 0.42, size: 2 },
    { top: H * 0.15, left: W * 0.85, size: 3 },
  ]

  return (
    <Pressable onPress={onToggle}>
      <Animated.View
        style={[
          styles.track,
          {
            width: W,
            height: H,
            borderRadius: H / 2,
            backgroundColor: trackBg,
          },
        ]}
      >
        {/* Stars */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: starsOpacity }]}>
          {STAR_POSITIONS.map((star, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  borderRadius: star.size / 2,
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Clouds */}
        <Animated.View
          style={[
            styles.cloudsContainer,
            { bottom: cloudBottom, left: s(6) },
          ]}
        >
          <View
            style={[
              styles.cloudPiece,
              {
                width: s(14),
                height: s(14),
                borderRadius: s(7),
                backgroundColor: CLOUD_COLOR,
              },
            ]}
          />
          <View
            style={[
              styles.cloudPiece,
              {
                position: "absolute",
                left: s(10),
                bottom: 0,
                width: s(18),
                height: s(12),
                borderRadius: s(6),
                backgroundColor: CLOUD_COLOR,
              },
            ]}
          />
          <View
            style={[
              styles.cloudPiece,
              {
                position: "absolute",
                left: s(-4),
                bottom: s(4),
                width: s(10),
                height: s(10),
                borderRadius: s(5),
                backgroundColor: CLOUD_BACK,
              },
            ]}
          />
          <View
            style={[
              styles.cloudPiece,
              {
                position: "absolute",
                left: s(22),
                bottom: s(2),
                width: s(12),
                height: s(10),
                borderRadius: s(5),
                backgroundColor: CLOUD_COLOR,
              },
            ]}
          />
          <View
            style={[
              styles.cloudPiece,
              {
                position: "absolute",
                left: s(16),
                bottom: s(6),
                width: s(8),
                height: s(8),
                borderRadius: s(4),
                backgroundColor: CLOUD_BACK,
              },
            ]}
          />
        </Animated.View>

        {/* Sun/Moon circle */}
        <Animated.View
          style={[
            styles.circle,
            {
              top: PAD,
              width: CIRCLE,
              height: CIRCLE,
              borderRadius: CIRCLE / 2,
              backgroundColor: circleBg,
              transform: [{ translateX: circleX }],
            },
          ]}
        >
          {/* Moon spots */}
          <Animated.View style={{ opacity: moonOpacity }}>
            <View
              style={[
                styles.spot,
                {
                  top: CIRCLE * 0.35,
                  left: CIRCLE * 0.18,
                  width: CIRCLE * 0.24,
                  height: CIRCLE * 0.24,
                  borderRadius: CIRCLE * 0.12,
                },
              ]}
            />
            <View
              style={[
                styles.spot,
                {
                  top: CIRCLE * 0.58,
                  left: CIRCLE * 0.55,
                  width: CIRCLE * 0.15,
                  height: CIRCLE * 0.15,
                  borderRadius: CIRCLE * 0.075,
                },
              ]}
            />
            <View
              style={[
                styles.spot,
                {
                  top: CIRCLE * 0.15,
                  left: CIRCLE * 0.5,
                  width: CIRCLE * 0.11,
                  height: CIRCLE * 0.11,
                  borderRadius: CIRCLE * 0.055,
                },
              ]}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: {
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  star: {
    position: "absolute",
    backgroundColor: STAR_COLOR,
  },
  cloudsContainer: {
    position: "absolute",
  },
  cloudPiece: {},
  circle: {
    position: "absolute",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: "hidden",
  },
  spot: {
    position: "absolute",
    backgroundColor: SPOT_COLOR,
  },
})
