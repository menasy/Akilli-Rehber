import { initWhisper, releaseAllWhisper, WhisperContext } from "whisper.rn"

/** Whisper transcription sonucu */
export interface WhisperResult {
  text: string
  language?: string
}

const TRANSCRIBE_OPTIONS = {
  language: "auto",
  maxThreads: 4,
  translate: false,
} as const

let whisperContext: WhisperContext | null = null
let activeModelPath: string | number | null = null
let modelLoadingPromise: Promise<WhisperContext> | null = null

/**
 * Whisper modelini yükler ve tekil context döndürür.
 */
export async function loadWhisperModel(modelPath: string | number): Promise<void> {
  if (whisperContext && activeModelPath === modelPath) {
    return
  }

  if (modelLoadingPromise) {
    await modelLoadingPromise
    return
  }

  modelLoadingPromise = (async () => {
    if (whisperContext && activeModelPath !== modelPath) {
      await whisperContext.release()
      whisperContext = null
    }

    whisperContext = await initWhisper({
      filePath: modelPath,
      isBundleAsset: typeof modelPath === "number",
      useGpu: false,
    })
    activeModelPath = modelPath
    return whisperContext
  })()

  try {
    await modelLoadingPromise
  } finally {
    modelLoadingPromise = null
  }
}

/**
 * Ses dosyasını transkribe eder.
 */
export async function transcribeAudio(
  audioPath: string,
  modelPath: string | number
): Promise<WhisperResult> {
  if (!audioPath) {
    throw new Error("Ses dosyasi bulunamadi.")
  }

  await loadWhisperModel(modelPath)

  if (!whisperContext) {
    throw new Error("Whisper modeli hazir degil.")
  }

  const { promise } = whisperContext.transcribe(audioPath, TRANSCRIBE_OPTIONS)
  const { result } = await promise
  const text = result.trim()

  if (!text) {
    throw new Error("Ses kaydi cozumlenemedi.")
  }

  return { text }
}

/**
 * Model'in yüklü olup olmadığını kontrol eder.
 */
export function isModelLoaded(): boolean {
  return whisperContext !== null
}

/**
 * Mevcut Whisper context'ini serbest bırakır.
 */
export async function releaseWhisperModel(): Promise<void> {
  if (whisperContext) {
    await whisperContext.release()
  }
  whisperContext = null
  activeModelPath = null
  modelLoadingPromise = null
}

/**
 * Tüm Whisper kaynaklarını global olarak serbest bırakır.
 */
export async function releaseAll(): Promise<void> {
  whisperContext = null
  activeModelPath = null
  modelLoadingPromise = null
  await releaseAllWhisper()
}
