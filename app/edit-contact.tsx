import React, { useState, useCallback } from "react"
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { File as ExpoFile, Paths } from "expo-file-system"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "../src/hooks/useTheme"
import { useResponsive } from "../src/theme/responsive"
import { useI18n } from "../src/i18n"
import { useContactsStore } from "../src/store/contactsStore"
import { useContactEditsStore } from "../src/store/contactEditsStore"

const DEFAULT_ICON = require("../assets/icon.png")

export default function EditContact() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const colors = useTheme()
  const { scale, verticalScale, moderateScale, width } = useResponsive()
  const { t } = useI18n()
  const insets = useSafeAreaInsets()

  const deviceContact = useContactsStore(
    (state) => state.contacts.find((c) => c.id === id)
  )
  const existingEdit = useContactEditsStore((state) => state.edits[id ?? ""])
  const setEdit = useContactEditsStore((state) => state.setEdit)

  const [name, setName] = useState(
    existingEdit?.name ?? deviceContact?.name ?? ""
  )
  const [avatarUri, setAvatarUri] = useState(
    existingEdit?.avatar ?? deviceContact?.avatar ?? ""
  )

  const handlePickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets[0]) {
      const sourceUri = result.assets[0].uri
      const fileName = `contact_${id}_${Date.now()}.jpg`
      const source = new ExpoFile(sourceUri)
      const dest = new ExpoFile(Paths.document, fileName)
      source.copy(dest)
      setAvatarUri(dest.uri)
    }
  }, [id])

  const handleSave = useCallback(() => {
    if (!id) return
    const edit: { name?: string; avatar?: string } = {}

    if (name !== deviceContact?.name) {
      edit.name = name
    }
    if (avatarUri !== deviceContact?.avatar) {
      edit.avatar = avatarUri
    }

    if (Object.keys(edit).length > 0) {
      setEdit(id, edit)
    }
    router.back()
  }, [id, name, avatarUri, deviceContact, setEdit])

  const handleBack = useCallback(() => {
    router.back()
  }, [])

  if (!deviceContact) return null

  const avatarSize = Math.min(scale(200), width * 0.5)
  const imageSource =
    avatarUri && avatarUri.length > 0 ? { uri: avatarUri } : DEFAULT_ICON

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + verticalScale(12),
              paddingHorizontal: scale(16),
              paddingBottom: verticalScale(12),
            },
          ]}
        >
          <Pressable onPress={handleBack} hitSlop={scale(16)}>
            <Ionicons
              name="arrow-back"
              size={moderateScale(30)}
              color={colors.textPrimary}
            />
          </Pressable>
          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.textPrimary,
                fontSize: moderateScale(22),
              },
            ]}
          >
            {t("edit.title")}
          </Text>
          <View style={{ width: moderateScale(30) }} />
        </View>

        {/* Avatar */}
        <Pressable onPress={handlePickImage} style={styles.avatarSection}>
          <View
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              overflow: "hidden",
            }}
          >
            <Image
              source={imageSource}
              defaultSource={DEFAULT_ICON}
              style={{ width: avatarSize, height: avatarSize }}
              resizeMode="cover"
            />
          </View>
          <Text
            style={[
              styles.changePhotoText,
              {
                color: colors.primary,
                fontSize: moderateScale(18),
                marginTop: verticalScale(12),
              },
            ]}
          >
            {t("edit.changePhoto")}
          </Text>
        </Pressable>

        {/* Name Input */}
        <View
          style={[
            styles.inputCard,
            {
              backgroundColor: colors.card,
              borderRadius: scale(16),
              marginHorizontal: scale(14),
              marginTop: verticalScale(24),
              padding: scale(20),
            },
          ]}
        >
          <Text
            style={[
              styles.inputLabel,
              {
                color: colors.textSecondary,
                fontSize: moderateScale(16),
                marginBottom: verticalScale(8),
              },
            ]}
          >
            {t("edit.name")}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[
              styles.textInput,
              {
                color: colors.textPrimary,
                fontSize: moderateScale(22),
                borderBottomColor: colors.border,
                paddingVertical: verticalScale(10),
              },
            ]}
            placeholderTextColor={colors.textDisabled}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: pressed ? colors.primaryPressed : colors.primary,
              borderRadius: scale(16),
              marginHorizontal: scale(14),
              marginTop: verticalScale(32),
              height: verticalScale(64),
            },
          ]}
        >
          <Text
            style={[
              styles.saveButtonText,
              { fontSize: moderateScale(22) },
            ]}
          >
            {t("edit.save")}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: "700",
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 24,
  },
  changePhotoText: {
    fontWeight: "600",
  },
  inputCard: {},
  inputLabel: {
    fontWeight: "600",
  },
  textInput: {
    borderBottomWidth: 1,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
})
