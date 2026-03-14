import { useState, useCallback, useRef } from "react"
import {
  Audio,
} from "expo-av"
import {
  AndroidOutputFormat,
  AndroidAudioEncoder,
  IOSOutputFormat,
  IOSAudioQuality,
} from "expo-av/build/Audio/RecordingConstants"
import type { RecordingOptions } from "expo-av/build/Audio/Recording.types"
import { useContactsStore } from "../store/contactsStore"
import { parseVoiceCommand } from "../ai/intentParser"
import { findMatches } from "../ai/matchingService"
import { callNumber } from "../services/callService"
import { useI18n } from "../i18n"
import { useWhisper } from "./useWhisper"
import type { Contact, VoiceSearchState } from "../types"

function logVoiceStage(stage: string, payload: Record<string, unknown>) {
  console.log(`[VoiceSearch][Hook][${stage}]`, payload)
}

/** Whisper için kayıt ayarları: 16kHz, mono. iOS'ta WAV/PCM, Android'de desteklenen en yakın native format. */
const WHISPER_RECORDING_OPTIONS: RecordingOptions = {
  isMeteringEnabled: false,
  android: {
    extension: ".m4a",
    outputFormat: AndroidOutputFormat.MPEG_4,
    audioEncoder: AndroidAudioEncoder.AAC,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  ios: {
    extension: ".wav",
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 256000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
}

const INITIAL_STATE: VoiceSearchState = {
  status: "idle",
  transcript: "",
  matches: [],
  error: null,
}

/**
 * Sesli arama hook'u.
 * expo-av ile ses kaydı yapar, NLP pipeline'ı çalıştırır, eşleşmeleri döndürür.
 */
export function useVoiceSearch() {
  const [state, setState] = useState<VoiceSearchState>(INITIAL_STATE)
  const recordingRef = useRef<Audio.Recording | null>(null)
  const isTransitioningRef = useRef(false)
  const contacts = useContactsStore((s) => s.contacts)
  const { transcribe, isModelReady } = useWhisper()
  const { t, language } = useI18n()

  /** Mikrofon izni alır ve kaydı başlatır */
  const startListening = useCallback(async () => {
    if (
      isTransitioningRef.current ||
      recordingRef.current ||
      state.status === "listening" ||
      state.status === "processing" ||
      state.status === "modelLoading"
    ) {
      return
    }

    try {
      isTransitioningRef.current = true
      logVoiceStage("StartListeningRequested", {
        contactsCount: contacts.length,
      })
      setState((prev) => ({
        ...prev,
        status: "listening",
        transcript: "",
        matches: [],
        error: null,
      }))

      const permission = await Audio.requestPermissionsAsync()
      logVoiceStage("MicrophonePermission", {
        granted: permission.granted,
        canAskAgain: permission.canAskAgain,
        status: permission.status,
      })
      if (!permission.granted) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: t("voice.micPermissionDenied"),
        }))
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(
        WHISPER_RECORDING_OPTIONS
      )
      recordingRef.current = recording
      logVoiceStage("RecordingStarted", {
        preset: "WHISPER_16kHz_MONO_INPUT",
      })
    } catch (error) {
      recordingRef.current = null
      logVoiceStage("RecordingStartFailed", {
        error: error instanceof Error ? error.message : "unknown",
      })
      setState((prev) => ({
        ...prev,
        status: "error",
        error: t("voice.recordingFailed"),
      }))
    } finally {
      isTransitioningRef.current = false
    }
  }, [contacts.length, state.status, t])

  /** Kaydı durdurur ve NLP pipeline'ını çalıştırır */
  const stopListening = useCallback(async () => {
    if (
      isTransitioningRef.current ||
      state.status === "processing" ||
      state.status === "modelLoading"
    ) {
      return
    }

    try {
      isTransitioningRef.current = true
      logVoiceStage("StopListeningRequested", {})

      const recording = recordingRef.current
      if (recording) {
        setState((prev) => ({ ...prev, status: "processing", error: null }))
        await recording.stopAndUnloadAsync()
        const uri = recording.getURI() ?? ""
        recordingRef.current = null
        logVoiceStage("RecordingStopped", {
          uri,
        })

        await Audio.setAudioModeAsync({ allowsRecordingIOS: false })

        if (!uri) {
          throw new Error(t("voice.recordingNotFound"))
        }

        if (!isModelReady) {
          logVoiceStage("ModelLoading", {
            reason: "transcribe-request-before-model-ready",
          })
          setState((prev) => ({ ...prev, status: "modelLoading", error: null }))
        }

        const { text, language: detectedLang } = await transcribe(uri, language)
        logVoiceStage("WhisperResult", {
          text,
          language: detectedLang ?? "unknown",
        })

        // NLP pipeline
        const intent = parseVoiceCommand(text, detectedLang)
        logVoiceStage("IntentParsed", {
          detectedLanguage: intent.detectedLanguage,
          candidateNames: intent.candidateNames,
          normalizedCandidates: intent.normalizedCandidates,
        })
        const matches = findMatches(intent, contacts)
        logVoiceStage("MatchesResolved", {
          totalMatches: matches.length,
          matches: matches.map((match) => ({
            name: match.contact.name,
            phone: match.contact.phone,
            score: Number(match.score.toFixed(4)),
            confidence: match.confidence,
          })),
        })

        setState((prev) => ({
          ...prev,
          status: "result",
          transcript: text,
          matches,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: t("voice.recordingNotFound"),
        }))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t("voice.processingFailed")
      logVoiceStage("StopListeningFailed", {
        error: message,
      })
      setState((prev) => ({
        ...prev,
        status: "error",
        error: message,
      }))
    } finally {
      isTransitioningRef.current = false
    }
  }, [contacts, isModelReady, language, state.status, t, transcribe])

  /** State'i sıfırlar */
  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  /** Eşleşen kişiyi arar */
  const callMatch = useCallback((contact: Contact) => {
    callNumber(contact.phone)
  }, [])

  return { state, startListening, stopListening, reset, callMatch }
}
