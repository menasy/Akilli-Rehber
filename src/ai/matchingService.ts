import Fuse, { type IFuseOptions } from "fuse.js"
import {
  FUSE_THRESHOLD,
  CONFIDENCE,
  MULTI_CANDIDATE_DIFF,
  MAX_CANDIDATES,
} from "./nlpConstants"
import type { Contact, ParsedIntent, MatchResult } from "../types"

function logMatchingStage(stage: string, payload: Record<string, unknown>) {
  console.log(`[VoiceSearch][Matching][${stage}]`, payload)
}

/** Fuse.js arama seçenekleri */
const FUSE_OPTIONS: IFuseOptions<Contact> = {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "normalizedName", weight: 0.3 },
    { name: "phoneticName", weight: 0.2 },
  ],
  threshold: FUSE_THRESHOLD,
  includeScore: true,
  distance: 100,
  minMatchCharLength: 2,
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)
}

function getQueryVariants(intent: ParsedIntent): string[] {
  return Array.from(new Set([...intent.candidateNames, ...intent.normalizedCandidates]))
}

function getContactTokens(contact: Contact): string[] {
  return Array.from(new Set([...tokenize(contact.normalizedName), ...tokenize(contact.phoneticName)]))
}

function getOverlapScore(contact: Contact, query: string): number {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) {
    return 0
  }

  const contactTokens = getContactTokens(contact)
  let matches = 0

  for (const queryToken of queryTokens) {
    const hasMatch = contactTokens.some(
      (contactToken) =>
        contactToken === queryToken ||
        contactToken.startsWith(queryToken) ||
        queryToken.startsWith(contactToken)
    )

    if (hasMatch) {
      matches += 1
    }
  }

  return matches / queryTokens.length
}

function hasExactMatch(contact: Contact, queries: string[]): boolean {
  return queries.some(
    (query) => contact.normalizedName === query || contact.phoneticName === query
  )
}

function refineResults(intent: ParsedIntent, results: MatchResult[]): MatchResult[] {
  const queries = getQueryVariants(intent)

  const refined = results
    .map((result) => {
      const overlapScore = Math.max(
        ...queries.map((query) => getOverlapScore(result.contact, query)),
        0
      )
      const exactMatch = hasExactMatch(result.contact, queries)

      if (!exactMatch && overlapScore === 0 && result.score < CONFIDENCE.HIGH) {
        return null
      }

      const boostedScore = exactMatch
        ? 1
        : Math.min(1, result.score * 0.7 + overlapScore * 0.3)

      return {
        contact: result.contact,
        score: boostedScore,
        confidence: assignConfidence(boostedScore),
      }
    })
    .filter((result): result is MatchResult => result !== null)
    .sort((a, b) => b.score - a.score)

  logMatchingStage("RefineResults", {
    queries,
    refined: refined.slice(0, 5).map((item) => ({
      name: item.contact.name,
      phone: item.contact.phone,
      score: Number(item.score.toFixed(4)),
      confidence: item.confidence,
    })),
  })

  return refined
}

/**
 * Fuse.js sonuçlarını MatchResult[] formatına dönüştürür.
 * Fuse score 0 = tam eşleşme, 1 = hiç eşleşme olduğundan ters çevrilir.
 */
function fuseSearch(fuse: Fuse<Contact>, query: string): MatchResult[] {
  const results = fuse.search(query)
  const mapped = results.map((r) => ({
    contact: r.item,
    score: 1 - (r.score ?? 1), // Ters çevir: 1 = tam eşleşme, 0 = eşleşme yok
    confidence: assignConfidence(1 - (r.score ?? 1)),
  }))
  logMatchingStage("FuseSearch", {
    query,
    totalResults: mapped.length,
    topResults: mapped.slice(0, 5).map((item) => ({
      name: item.contact.name,
      phone: item.contact.phone,
      score: Number(item.score.toFixed(4)),
      confidence: item.confidence,
    })),
  })
  return mapped
}

/**
 * Score değerine göre güven seviyesi atar.
 */
function assignConfidence(score: number): "high" | "medium" | "low" {
  if (score >= CONFIDENCE.HIGH) return "high"
  if (score >= CONFIDENCE.MEDIUM) return "medium"
  return "low"
}

/**
 * Sonuçları birleştirir, aynı kişi birden fazla stratejide çıktıysa skorunu güçlendirir.
 */
function mergeResults(resultSets: MatchResult[][]): MatchResult[] {
  const scoreMap = new Map<string, { contact: Contact; totalScore: number; count: number }>()

  for (const results of resultSets) {
    for (const result of results) {
      const existing = scoreMap.get(result.contact.id)
      if (existing) {
        existing.totalScore += result.score
        existing.count += 1
      } else {
        scoreMap.set(result.contact.id, {
          contact: result.contact,
          totalScore: result.score,
          count: 1,
        })
      }
    }
  }

  // Birden fazla stratejide eşleşen kişilere bonus (%20 per extra hit)
  return Array.from(scoreMap.values())
    .map(({ contact, totalScore, count }) => {
      const boostedScore = Math.min(1, (totalScore / count) * (1 + (count - 1) * 0.2))
      return {
        contact,
        score: boostedScore,
        confidence: assignConfidence(boostedScore),
      }
    })
    .sort((a, b) => b.score - a.score)
}

/**
 * ParsedIntent'ten en iyi eşleşmeleri bulur.
 * Strateji sırası:
 * 1. candidateNames[0] ile tam metin ara
 * 2. normalizedCandidates[0] ile ara
 * 3. Birden fazla kelime varsa her kelimeyi ayrı ara
 * 4. Sonuçları birleştir ve sırala
 * 5. MULTI_CANDIDATE_DIFF kontrolü ile çoklu aday döndür
 */
export function findMatches(intent: ParsedIntent, contacts: Contact[]): MatchResult[] {
  logMatchingStage("Start", {
    candidateNames: intent.candidateNames,
    normalizedCandidates: intent.normalizedCandidates,
    contactsCount: contacts.length,
  })

  if (intent.candidateNames.length === 0 || contacts.length === 0) {
    logMatchingStage("EarlyExit", {
      reason:
        intent.candidateNames.length === 0 ? "no-candidate-names" : "no-contacts-available",
    })
    return []
  }

  const fuse = new Fuse(contacts, FUSE_OPTIONS)
  const resultSets: MatchResult[][] = []

  // Strateji 1: candidateNames[0] ile tam metin ara
  const primaryName = intent.candidateNames[0]
  resultSets.push(fuseSearch(fuse, primaryName))

  // Strateji 2: normalizedCandidates[0] ile ara
  if (intent.normalizedCandidates.length > 0) {
    const normalizedName = intent.normalizedCandidates[0]
    if (normalizedName !== primaryName) {
      resultSets.push(fuseSearch(fuse, normalizedName))
    }
  }

  // Strateji 3: Birden fazla kelime varsa her kelimeyi ayrı ara
  const words = primaryName.split(/\s+/)
  if (words.length > 1) {
    for (const word of words) {
      if (word.length >= 2) {
        resultSets.push(fuseSearch(fuse, word))
      }
    }
  }

  // Sonuçları birleştir
  const merged = refineResults(intent, mergeResults(resultSets))
  logMatchingStage("MergedResults", {
    merged: merged.slice(0, 5).map((item) => ({
      name: item.contact.name,
      phone: item.contact.phone,
      score: Number(item.score.toFixed(4)),
      confidence: item.confidence,
    })),
  })

  if (merged.length === 0) return []

  // MULTI_CANDIDATE_DIFF kontrolü
  const best = merged[0]
  const candidates: MatchResult[] = [best]

  for (let i = 1; i < merged.length && candidates.length < MAX_CANDIDATES; i++) {
    if (best.score - merged[i].score < MULTI_CANDIDATE_DIFF) {
      candidates.push(merged[i])
    } else {
      break
    }
  }

  logMatchingStage("FinalCandidates", {
    bestScore: Number(best.score.toFixed(4)),
    candidates: candidates.map((item) => ({
      name: item.contact.name,
      phone: item.contact.phone,
      score: Number(item.score.toFixed(4)),
      confidence: item.confidence,
    })),
  })

  return candidates
}
