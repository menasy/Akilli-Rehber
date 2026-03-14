import { Paths, File, Directory } from "expo-file-system"
import { Asset } from "expo-asset"

const MODEL_DIR = "models"
const MODEL_FILENAME = "ggml-base.bin"

/**
 * Whisper modelinin app storage'da mevcut olduğunu garanti eder.
 * İlk çalıştırmada assets'ten kopyalar, sonraki çalıştırmalarda mevcut path'i döndürür.
 */
export async function ensureWhisperModel(): Promise<string> {
  const targetDir = new Directory(Paths.document, MODEL_DIR)
  const targetFile = new File(Paths.document, MODEL_DIR, MODEL_FILENAME)

  // Hedef klasörü oluştur
  if (!targetDir.exists) {
    targetDir.create({ intermediates: true })
  }

  // Model zaten kopyalanmış mı kontrol et
  if (targetFile.exists) {
    console.log("[ModelManager] Model zaten mevcut:", targetFile.uri)
    return targetFile.uri
  }

  // Asset'i yükle — downloadAsync() çağrılmazsa localUri oluşmaz
  console.log("[ModelManager] Model assets'ten kopyalanıyor...")
  const asset = Asset.fromModule(
    require("../../assets/models/ggml-base.bin") as number
  )
  await asset.downloadAsync()

  if (!asset.localUri) {
    throw new Error("Model asset localUri oluşturulamadı")
  }

  // Asset'ten kopyala
  const sourceFile = new File(asset.localUri)
  sourceFile.copy(targetFile)

  // Doğrulama
  if (!targetFile.exists) {
    throw new Error("Model kopyalama başarısız oldu")
  }

  console.log("[ModelManager] Model başarıyla kopyalandı:", targetFile.uri)
  return targetFile.uri
}
