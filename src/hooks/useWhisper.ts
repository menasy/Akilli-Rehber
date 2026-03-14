import { useState, useCallback, useRef } from "react"
import {
  loadWhisperModel,
  transcribeAudio,
  isModelLoaded,
  releaseWhisperModel,
} from "../ai/whisperService"
import { ensureWhisperModel } from "../ai/modelManager"
import type { WhisperResult } from "../ai/whisperService"

/** Model dosyası assets'ten app storage'a kopyalanır ve gerçek path kullanılır. */

function logWhisperStage(stage: string, payload: Record<string, unknown>) {
  console.log(`[VoiceSearch][Whisper][${stage}]`, payload)
}

interface UseWhisperState {
  isModelLoading: boolean
  isTranscribing: boolean
  error: string | null
}

/**
 * Whisper offline speech recognition hook'u.
 * Lazy load: model ilk kullanımda yüklenir.
 * Singleton: tüm uygulama tek context paylaşır.
 * Model dosyası ilk çalıştırmada assets'ten app storage'a kopyalanır
 * ve whisper.rn'e gerçek filesystem path olarak verilir.
 */
export function useWhisper() {
  const [state, setState] = useState<UseWhisperState>({
    isModelLoading: false,
    isTranscribing: false,
    error: null,
  })
  const modelLoadedRef = useRef(isModelLoaded())
  const modelPathRef = useRef<string | null>(null)

  /** Whisper modelini yükler (zaten yüklüyse atlar) */
  const loadModel = useCallback(async () => {
    if (modelLoadedRef.current) return

    setState((prev) => ({ ...prev, isModelLoading: true, error: null }))
    try {
      logWhisperStage("ModelPreparing", { phase: "ensureWhisperModel" })
      const modelPath = await ensureWhisperModel()
      modelPathRef.current = modelPath

      logWhisperStage("ModelLoadRequested", {
        source: "filesystem",
        path: modelPath,
      })
      await loadWhisperModel(modelPath)
      modelLoadedRef.current = true
      logWhisperStage("ModelLoaded", {
        source: "filesystem",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Model load failed"
      logWhisperStage("ModelLoadFailed", {
        error: message,
      })
      setState((prev) => ({ ...prev, error: message }))
      throw err
    } finally {
      setState((prev) => ({ ...prev, isModelLoading: false }))
    }
  }, [])

  /** Ses dosyasını transkribe eder. Model yüklü değilse önce yükler. */
  const transcribe = useCallback(
    async (audioPath: string, language?: string): Promise<WhisperResult> => {
      // Lazy load
      if (!modelLoadedRef.current) {
        await loadModel()
      }

      const modelPath = modelPathRef.current
      if (!modelPath) {
        throw new Error("Model path bulunamadı")
      }

      const whisperLang = (language === "tr" || language === "ku") ? language : "tr"

      setState((prev) => ({ ...prev, isTranscribing: true, error: null }))
      try {
        const result = await transcribeAudio(audioPath, modelPath, whisperLang)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : "Transkripsiyon basarisiz oldu"
        setState((prev) => ({ ...prev, error: message }))
        throw err
      } finally {
        setState((prev) => ({ ...prev, isTranscribing: false }))
      }
    },
    [loadModel]
  )

  /** Model kaynaklarını serbest bırakır */
  const release = useCallback(async () => {
    await releaseWhisperModel()
    modelLoadedRef.current = false
  }, [])

  return {
    ...state,
    isModelReady: modelLoadedRef.current,
    loadModel,
    transcribe,
    release,
  }
}
