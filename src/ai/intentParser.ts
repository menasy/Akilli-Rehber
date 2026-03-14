import {
  TR_STOP_WORDS,
  KU_STOP_WORDS,
  TR_SUFFIXES,
  KU_SUFFIXES,
  TR_LANGUAGE_MARKERS,
  KU_LANGUAGE_MARKERS,
  TR_COMMAND_PATTERNS,
  KU_COMMAND_PATTERNS,
  GREETING_WORDS,
  MIN_NAME_LENGTH,
} from "./nlpConstants"
import { phoneticNormalize } from "./phoneticNormalizer"
import type { DetectedLanguage, ParsedIntent } from "../types"

function logStage(stage: string, payload: Record<string, unknown>) {
  console.log(`[VoiceSearch][IntentParser][${stage}]`, payload)
}

/**
 * Metinden dili tespit eder.
 * Önce langHint'e bakar, sonra marker sayımıyla çift kontrol yapar.
 * Türkçe marker 2+ → 'tr', Kürtçe marker 2+ → 'ku', diğer → 'unknown'
 */
export function detectLanguage(text: string, langHint?: string): DetectedLanguage {
  const lower = text.toLowerCase()
  const words = lower.split(/\s+/)

  let trCount = 0
  let kuCount = 0

  for (const word of words) {
    if (TR_LANGUAGE_MARKERS.has(word)) trCount++
    if (KU_LANGUAGE_MARKERS.has(word)) kuCount++
  }

  // İki kelimelik marker'ları da kontrol et
  for (const marker of TR_LANGUAGE_MARKERS) {
    if (marker.includes(" ") && lower.includes(marker)) trCount++
  }
  for (const marker of KU_LANGUAGE_MARKERS) {
    if (marker.includes(" ") && lower.includes(marker)) kuCount++
  }

  if (langHint === "tr" && trCount >= 1) return "tr"
  if (langHint === "ku" && kuCount >= 1) return "ku"

  if (trCount >= 2 && trCount > kuCount) return "tr"
  if (kuCount >= 2 && kuCount > trCount) return "ku"
  if (trCount >= 2) return "tr"
  if (kuCount >= 2) return "ku"

  if (langHint === "tr" || langHint === "ku") return langHint

  return "unknown"
}

/**
 * Selamlama kelimelerini metnin başından temizler.
 * Birden fazla selamlama ardışık gelebilir.
 */
export function removeGreetings(text: string): string {
  const lower = text.toLowerCase().trim()
  const words = lower.split(/\s+/)
  let startIndex = 0

  while (startIndex < words.length) {
    const word = words[startIndex]
    // Tek kelimelik selamlama kontrolü
    if (GREETING_WORDS.has(word)) {
      startIndex++
      continue
    }
    // İki kelimelik selamlama kontrolü
    if (startIndex + 1 < words.length) {
      const twoWords = `${word} ${words[startIndex + 1]}`
      if (GREETING_WORDS.has(twoWords)) {
        startIndex += 2
        continue
      }
    }
    break
  }

  return words.slice(startIndex).join(" ")
}

/**
 * Verilen dile göre stop word temizliği yapar.
 * detectedLang 'unknown' ise her iki listeyi de uygular.
 * Substring değil, kelime bazlı karşılaştırır.
 */
export function removeStopWords(text: string, lang: DetectedLanguage): string {
  let result = text.toLowerCase().trim()

  const stopSets: Set<string>[] = []
  if (lang === "tr" || lang === "unknown") stopSets.push(TR_STOP_WORDS)
  if (lang === "ku" || lang === "unknown") stopSets.push(KU_STOP_WORDS)

  // Önce çok kelimeli stop word'leri temizle (uzundan kısaya)
  for (const stopSet of stopSets) {
    const multiWordStops = Array.from(stopSet)
      .filter((sw) => sw.includes(" "))
      .sort((a, b) => b.length - a.length)

    for (const sw of multiWordStops) {
      // Kelime sınırı kontrollü değiştirme
      const escaped = sw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, "gi")
      result = result.replace(regex, " ")
    }
  }

  // Tekli kelime bazlı temizlik
  const words = result.split(/\s+/).filter(Boolean)
  const filtered = words.filter((word) => {
    const lower = word.toLowerCase()
    for (const stopSet of stopSets) {
      if (stopSet.has(lower)) return false
    }
    return true
  })

  return filtered.join(" ").trim()
}

/**
 * Son kelimeden dile uygun ekleri temizler.
 * Sonuç MIN_NAME_LENGTH'den kısa kalırsa eki uygulamaz.
 * Sadece son kelimeye uygulanır.
 */
export function removeSuffixes(text: string, lang: DetectedLanguage): string {
  const words = text.trim().split(/\s+/)
  if (words.length === 0) return text

  const lastWord = words[words.length - 1]

  const suffixLists: Array<[RegExp, string]>[] = []
  if (lang === "tr" || lang === "unknown") suffixLists.push(TR_SUFFIXES)
  if (lang === "ku" || lang === "unknown") suffixLists.push(KU_SUFFIXES)

  let cleaned = lastWord
  for (const suffixes of suffixLists) {
    for (const [pattern, replacement] of suffixes) {
      const candidate = cleaned.replace(pattern, replacement)
      if (candidate !== cleaned && candidate.length >= MIN_NAME_LENGTH) {
        cleaned = candidate
        break // İlk eşleşen eki uygula (uzundan kısaya sıralı)
      }
    }
    if (cleaned !== lastWord) break
  }

  words[words.length - 1] = cleaned
  return words.join(" ")
}

/**
 * Command pattern'leri dener, eşleşirse capture group 1'i döndürür.
 * Eşleşme yoksa null döndürür.
 */
export function extractFromPatterns(text: string, lang: DetectedLanguage): string | null {
  const patterns: RegExp[] = []
  if (lang === "tr" || lang === "unknown") patterns.push(...TR_COMMAND_PATTERNS)
  if (lang === "ku" || lang === "unknown") patterns.push(...KU_COMMAND_PATTERNS)

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  return null
}

/**
 * Ana parse fonksiyonu — tüm NLP adımlarını orchestrate eder.
 * 1. Selamlamaları kaldır
 * 2. Dili tespit et
 * 3. Command pattern'lerini dene (başarılıysa hızlı yol)
 * 4. Stop word temizle
 * 5. Ek temizle
 * 6. MIN_NAME_LENGTH kontrolü
 * 7. Orijinal + fonetik normalize versiyonları üret
 */
export function parseVoiceCommand(rawText: string, langHint?: string): ParsedIntent {
  const cleaned = rawText.toLowerCase().trim()
  const detectedLanguage = detectLanguage(cleaned, langHint)
  logStage("Input", {
    rawText,
    cleaned,
    langHint: langHint ?? "none",
    detectedLanguage,
  })

  // 1. Selamlamaları kaldır
  const withoutGreetings = removeGreetings(cleaned)
  logStage("RemoveGreetings", {
    before: cleaned,
    after: withoutGreetings,
  })

  // 2. Command pattern'lerini dene (hızlı yol)
  const patternResult = extractFromPatterns(withoutGreetings, detectedLanguage)
  logStage("PatternExtract", {
    input: withoutGreetings,
    patternResult,
  })
  if (patternResult) {
    const suffixCleaned = removeSuffixes(patternResult, detectedLanguage)
    const candidate = suffixCleaned.trim()
    const normalizedCandidate = phoneticNormalize(candidate)
    logStage("PatternSuffixCleanup", {
      before: patternResult,
      after: suffixCleaned,
      candidate,
      normalizedCandidate,
    })
    if (candidate.length >= MIN_NAME_LENGTH) {
      return {
        rawText,
        detectedLanguage,
        candidateNames: [candidate],
        normalizedCandidates: [normalizedCandidate],
      }
    }
  }

  // 3. Stop word temizle
  const withoutStopWords = removeStopWords(withoutGreetings, detectedLanguage)
  logStage("RemoveStopWords", {
    before: withoutGreetings,
    after: withoutStopWords,
  })

  // 4. Ek temizle
  const withoutSuffixes = removeSuffixes(withoutStopWords, detectedLanguage)
  logStage("RemoveSuffixes", {
    before: withoutStopWords,
    after: withoutSuffixes,
  })

  // 5. MIN_NAME_LENGTH kontrolü
  const candidate = withoutSuffixes.trim()
  const normalizedCandidate =
    candidate.length >= MIN_NAME_LENGTH ? phoneticNormalize(candidate) : null
  logStage("Candidate", {
    candidate,
    normalizedCandidate,
    minNameLength: MIN_NAME_LENGTH,
    isValid: candidate.length >= MIN_NAME_LENGTH,
  })
  if (candidate.length < MIN_NAME_LENGTH) {
    return {
      rawText,
      detectedLanguage,
      candidateNames: [],
      normalizedCandidates: [],
    }
  }

  return {
    rawText,
    detectedLanguage,
    candidateNames: [candidate],
    normalizedCandidates: normalizedCandidate ? [normalizedCandidate] : [],
  }
}
