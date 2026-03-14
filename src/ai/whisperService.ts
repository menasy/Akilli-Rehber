import { initWhisper, releaseAllWhisper, WhisperContext } from "whisper.rn"

/** Whisper transcription sonucu */
export interface WhisperResult {
  text: string
  language?: string
}

/** Whisper için desteklenen dil kodları */
type WhisperLanguage = "tr" | "ku" | "auto"

function buildTranscribeOptions(language: WhisperLanguage) {
  return {
    language: language === "ku" ? "auto" : language,
    maxThreads: 4,
    translate: false,
  }
}

let whisperContext: WhisperContext | null = null
let activeModelPath: string | null = null
let modelLoadingPromise: Promise<WhisperContext> | null = null

/**
 * Whisper modelini yükler ve tekil context döndürür.
 */
export async function loadWhisperModel(modelPath: string): Promise<void> {
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
 * Base model ile en stabil sonuç için 16kHz mono giriş beklenir.
 * WAV/PCM tercih edilir; desteklenen diğer formatları native katman decode eder.
 */
export async function transcribeAudio(
  audioPath: string,
  modelPath: string,
  language: WhisperLanguage = "tr"
): Promise<WhisperResult> {
  if (!audioPath) {
    throw new Error("Ses dosyasi bulunamadi.")
  }

  await loadWhisperModel(modelPath)

  if (!whisperContext) {
    throw new Error("Whisper modeli hazir degil.")
  }

  const options = buildTranscribeOptions(language)
  console.log("[WhisperService] Transcribe başlıyor:", {
    audioPath,
    language: options.language,
  })

  const { promise } = whisperContext.transcribe(audioPath, options)
  const result = await promise
  const text = (result.result ?? "").trim()

  console.log("[WhisperService] Transcribe sonuç:", {
    text: text || "(boş)",
    language: result.language ?? "unknown",
    segments: result.segments?.length ?? 0,
    isAborted: result.isAborted ?? false,
  })

  if (!text) {
    throw new Error("Ses kaydi cozumlenemedi.")
  }

  return { text, language: result.language }
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
