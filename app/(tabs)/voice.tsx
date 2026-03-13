import { View, Text, Pressable, StyleSheet } from "react-native"
import { useTheme } from "../../src/hooks/useTheme"
import { useI18n } from "../../src/i18n"
import { useResponsive } from "../../src/theme/responsive"
import { Ionicons } from "@expo/vector-icons"

export default function Voice() {
  const colors = useTheme()
  const { t } = useI18n()
  const { scale, verticalScale, moderateScale } = useResponsive()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.micCircle,
            {
              width: scale(120),
              height: scale(120),
              borderRadius: scale(60),
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Ionicons name="mic" size={moderateScale(48)} color="#FFFFFF" />
        </View>
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: moderateScale(16),
              marginTop: verticalScale(24),
            },
          ]}
        >
          {t("voice.start")}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  micCircle: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  label: {
    fontWeight: "600",
  },
})
