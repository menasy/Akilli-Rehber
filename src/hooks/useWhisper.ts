import { useState, useCallback, useRef } from "react"
import {
  loadWhisperModel,
  transcribeAudio,
  isModelLoaded,
  releaseWhisperModel,
} from "../ai/whisperService"
import type { WhisperResult } from "../ai/whisperService"

/** Model dosyası bundle asset olarak doğrudan whisper.rn'e verilir. */
const MODEL_ASSET = require("../../assets/models/ggml-tiny.bin")

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
 * Model dosyası bundle asset olarak assets/models/ggml-tiny.bin altında tutulur
 * ve whisper.rn'e doğrudan asset referansı olarak verilir.
 */
export function useWhisper() {
  const [state, setState] = useState<UseWhisperState>({
    isModelLoading: false,
    isTranscribing: false,
    error: null,
  })
  const modelLoadedRef = useRef(isModelLoaded())

  /** Whisper modelini yükler (zaten yüklüyse atlar) */
  const loadModel = useCallback(async () => {
    if (modelLoadedRef.current) return

    setState((prev) => ({ ...prev, isModelLoading: true, error: null }))
    try {
      logWhisperStage("ModelLoadRequested", {
        source: "bundle-asset",
        assetId: MODEL_ASSET,
      })
      await loadWhisperModel(MODEL_ASSET)
      modelLoadedRef.current = true
      logWhisperStage("ModelLoaded", {
        source: "bundle-asset",
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
    async (audioPath: string): Promise<WhisperResult> => {
      // Lazy load
      if (!modelLoadedRef.current) {
        await loadModel()
      }

      setState((prev) => ({ ...prev, isTranscribing: true, error: null }))
      try {
        const result = await transcribeAudio(audioPath, MODEL_ASSET)
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
