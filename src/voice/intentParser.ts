import {
  getLanguageConstants,
  MIN_NAME_LENGTH,
} from "./nlpConstants"
import type { SupportedLanguage, ParsedIntent } from "./types"
import { voiceLog } from "./logger"

function removeGreetings(text: string, greetings: Set<string>): string {
  let result = text
  for (const greeting of greetings) {
    if (result.startsWith(greeting)) {
      result = result.slice(greeting.length).trim()
      break
    }
  }
  return result
}

function extractNameFromPattern(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      return match[1].trim()
    }
  }
  return null
}

function removeStopWords(text: string, stopWords: Set<string>): string {
  const words = text.split(/\s+/)
  const filtered = words.filter((word) => !stopWords.has(word))
  return filtered.join(" ").trim()
}

function removeSuffixes(text: string, suffixes: Array<[RegExp, string]>): string {
  const words = text.split(/\s+/)
  if (words.length === 0) return text

  const lastWord = words[words.length - 1]
  let cleaned = lastWord

  for (const [pattern, replacement] of suffixes) {
    const result = cleaned.replace(pattern, replacement)
    if (result !== cleaned && result.length >= MIN_NAME_LENGTH) {
      cleaned = result
      break
    }
  }

  return [...words.slice(0, -1), cleaned].join(" ").trim()
}

function calculateConfidence(name: string, originalText: string): number {
  if (!name || name.length < MIN_NAME_LENGTH) return 0

  let confidence = 0.5

  // Longer names are more likely to be real names
  if (name.length >= 3) confidence += 0.1
  if (name.length >= 5) confidence += 0.1

  // If the name is a smaller portion of the original text, the command structure was clear
  const ratio = name.length / originalText.length
  if (ratio < 0.6) confidence += 0.15
  if (ratio < 0.4) confidence += 0.1

  return Math.min(confidence, 1)
}

export function parseIntent(
  transcript: string,
  language: SupportedLanguage
): ParsedIntent {
  const constants = getLanguageConstants(language)
  const original = transcript.trim()
  let text = original.toLowerCase()
  voiceLog("intent:receivedTranscript", { original, language })

  // 1. Remove greetings
  text = removeGreetings(text, constants.greetingWords)
  voiceLog("intent:afterGreetingCleanup", { text })
  if (!text) {
    voiceLog("intent:emptyAfterGreetingCleanup")
    return {
      intent: "unknown",
      candidateNames: [],
      confidence: 0,
      originalText: original,
      language,
    }
  }

  // 2. Try extracting name from command patterns (most reliable)
  const patternName = extractNameFromPattern(text, constants.commandPatterns)
  voiceLog("intent:patternExtraction", { patternName })
  if (patternName && patternName.length >= MIN_NAME_LENGTH) {
    const cleaned = removeSuffixes(patternName, constants.suffixes)
    voiceLog("intent:afterSuffixCleanupFromPattern", { cleaned })
    if (cleaned.length >= MIN_NAME_LENGTH) {
      voiceLog("intent:resolvedFromPattern", { cleaned })
      return {
        intent: "call",
        candidateNames: [cleaned],
        confidence: calculateConfidence(cleaned, original),
        originalText: original,
        language,
      }
    }
  }

  // 3. Fallback: remove stop words and use remaining text as name
  const remaining = removeStopWords(text, constants.stopWords)
  voiceLog("intent:afterStopWordCleanup", { remaining })
  if (remaining && remaining.length >= MIN_NAME_LENGTH) {
    const cleaned = removeSuffixes(remaining, constants.suffixes)
    voiceLog("intent:afterSuffixCleanupFromRemaining", { cleaned })
    if (cleaned.length >= MIN_NAME_LENGTH) {
      voiceLog("intent:resolvedFromRemaining", { cleaned })
      return {
        intent: "call",
        candidateNames: [cleaned],
        confidence: calculateConfidence(cleaned, original) * 0.8,
        originalText: original,
        language,
      }
    }
  }

  // 4. Last resort: use the entire cleaned text as a potential name
  if (text.length >= MIN_NAME_LENGTH) {
    voiceLog("intent:lastResortUsed", { text })
    return {
      intent: "call",
      candidateNames: [text],
      confidence: 0.3,
      originalText: original,
      language,
    }
  }

  voiceLog("intent:unknown", { text })
  return {
    intent: "unknown",
    candidateNames: [],
    confidence: 0,
    originalText: original,
    language,
  }
}
