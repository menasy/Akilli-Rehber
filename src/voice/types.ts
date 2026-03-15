import type { Contact } from "../types"
import type { SupportedLanguage } from "./nlpConstants"

export type { SupportedLanguage }

export interface VoiceTranscript {
  text: string
  confidence: number
  language?: SupportedLanguage
}

export interface ParsedIntent {
  intent: "call" | "unknown"
  candidateNames: string[]
  confidence: number
  originalText: string
  language: SupportedLanguage
}

export interface MatchResult {
  contact: Contact
  score: number
  confidence: "high" | "medium" | "low"
}

export interface VoiceSearchState {
  isListening: boolean
  isProcessing: boolean
  error: string | null
  matches: MatchResult[]
  showResults: boolean
}

export type VoiceErrorCode =
  | "PERMISSION"
  | "NO_MATCH"
  | "TIMEOUT"
  | "PARSE"
  | "SERVICE_UNAVAILABLE"
  | "UNKNOWN"
