import { useCallback, useRef } from "react"
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition"
import { useVoiceStore } from "../store/voiceStore"
import { parseIntent } from "../voice/intentParser"
import { findMatches } from "../voice/matchingService"
import { useContactsStore } from "../store/contactsStore"
import { useSettingsStore } from "../store/settingsStore"
import { callNumber } from "../services/callService"
import type { Contact } from "../types"
import type { SupportedLanguage } from "../voice/types"
import { voiceLog } from "../voice/logger"

const VOICE_LOCALE_MAP: Record<SupportedLanguage, string> = {
  tr: "tr-TR",
  ku: "ku-TR",
  ar: "ar-SA",
}

export function useVoiceSearch() {
  const {
    state,
    startListening: storeStartListening,
    stopListening: storeStopListening,
    setProcessing,
    setTranscript,
    setMatches,
    setError,
    reset,
  } = useVoiceStore()

  const contacts = useContactsStore((s) => s.contacts)
  const language = useSettingsStore((s) => s.language) as SupportedLanguage
  const processingRef = useRef(false)

  const processTranscript = useCallback(
    (text: string) => {
      if (processingRef.current) return
      processingRef.current = true
      voiceLog("processTranscript:start", { text, language, contactsCount: contacts.length })

      setProcessing(true)
      storeStopListening()

      try {
        const intent = parseIntent(text, language)
        voiceLog("processTranscript:intentParsed", {
          intent: intent.intent,
          candidateNames: intent.candidateNames,
          confidence: intent.confidence,
        })

        if (intent.intent === "unknown" || intent.candidateNames.length === 0) {
          voiceLog("processTranscript:noIntentMatch", { text })
          setMatches([])
          setError("voice.notFound")
          processingRef.current = false
          return
        }

        const candidateName = intent.candidateNames[0]
        voiceLog("processTranscript:candidateSelected", { candidateName })
        const matches = findMatches(candidateName, contacts, language)
        voiceLog("processTranscript:matchesFound", {
          count: matches.length,
          matches: matches.map((match) => ({
            id: match.contact.id,
            name: match.contact.name,
            confidence: match.confidence,
            score: Number(match.score.toFixed(3)),
          })),
        })

        if (matches.length === 0) {
          setMatches([])
          setError("voice.notFound")
          processingRef.current = false
          return
        }

        // Single high-confidence match -> auto-call
        if (matches.length === 1 && matches[0].confidence === "high") {
          voiceLog("processTranscript:autoCall", {
            contactId: matches[0].contact.id,
            contactName: matches[0].contact.name,
          })
          callNumber(matches[0].contact.phone)
          reset()
          processingRef.current = false
          return
        }

        voiceLog("processTranscript:showResults", { count: matches.length })
        setMatches(matches)
        processingRef.current = false
      } catch (err) {
        voiceLog("processTranscript:error", {
          message: err instanceof Error ? err.message : String(err),
        })
        setError("voice.processingFailed")
        processingRef.current = false
      }
    },
    [language, contacts, setProcessing, storeStopListening, setMatches, setError, reset]
  )

  // expo-speech-recognition event hooks
  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results[0]?.transcript
    voiceLog("speech:result", {
      isFinal: event.isFinal,
      transcript,
      confidence: event.results[0]?.confidence,
    })

    if (transcript) {
      setTranscript(transcript)
      if (event.isFinal) {
        processTranscript(transcript)
      }
    }
  })

  useSpeechRecognitionEvent("error", (event) => {
    voiceLog("speech:error", { error: event.error, message: event.message })

    if (event.error === "no-speech" || event.error === "speech-timeout") {
      setError("voice.notFound")
    } else if (event.error === "not-allowed") {
      setError("voice.micPermissionDenied")
    } else if (event.error === "service-not-allowed") {
      setError("voice.speechServiceMissing")
    } else if (event.error === "language-not-supported") {
      setError("voice.speechNotAvailable")
    } else {
      setError("voice.errorMessage")
    }
  })

  useSpeechRecognitionEvent("end", () => {
    voiceLog("speech:end")
    storeStopListening()
  })

  const startVoiceSearch = useCallback(async () => {
    processingRef.current = false
    reset()
    storeStartListening()
    voiceLog("recording:startRequested", { language })

    try {
      const permResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync()
      voiceLog("recording:permissionResult", { status: permResult.status })

      if (!permResult.granted) {
        setError("voice.micPermissionDenied")
        return
      }

      const isAvailable = ExpoSpeechRecognitionModule.isRecognitionAvailable()
      voiceLog("recording:availabilityChecked", { isAvailable })

      if (!isAvailable) {
        setError("voice.speechNotAvailable")
        return
      }

      const locale = VOICE_LOCALE_MAP[language]
      voiceLog("recording:start", { locale })

      ExpoSpeechRecognitionModule.start({
        lang: locale,
        interimResults: true,
        maxAlternatives: 1,
        requiresOnDeviceRecognition: false,
      })
    } catch (err) {
      voiceLog("recording:startError", {
        message: err instanceof Error ? err.message : String(err),
      })
      setError("voice.recordingFailed")
    }
  }, [language, reset, storeStartListening, setError])

  const stopVoiceSearch = useCallback(() => {
    voiceLog("recording:stopRequested")
    try {
      ExpoSpeechRecognitionModule.stop()
      voiceLog("recording:stop")
    } catch (err) {
      voiceLog("recording:stopError", {
        message: err instanceof Error ? err.message : String(err),
      })
    }
    storeStopListening()
  }, [storeStopListening])

  const selectContact = useCallback(
    (contact: Contact) => {
      voiceLog("results:contactSelected", { id: contact.id, name: contact.name })
      callNumber(contact.phone)
      reset()
    },
    [reset]
  )

  return {
    isListening: state.isListening,
    isProcessing: state.isProcessing,
    transcript: state.transcript,
    matches: state.matches,
    error: state.error,
    showResults: state.showResults,
    startVoiceSearch,
    stopVoiceSearch,
    selectContact,
    reset,
  }
}
