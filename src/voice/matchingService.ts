import Fuse from "fuse.js"
import {
  FUSE_THRESHOLD,
  CONFIDENCE,
  MAX_CANDIDATES,
  MULTI_CANDIDATE_DIFF,
} from "./nlpConstants"
import type { Contact } from "../types"
import type { SupportedLanguage, MatchResult } from "./types"
import { voiceLog } from "./logger"

export function findMatches(
  candidateName: string,
  contacts: Contact[],
  _language: SupportedLanguage
): MatchResult[] {
  voiceLog("matching:start", { candidateName, contactsCount: contacts.length })
  if (!candidateName || contacts.length === 0) {
    voiceLog("matching:skipped", { candidateName, contactsCount: contacts.length })
    return []
  }

  const threshold = contacts.length > 500 ? 0.35 : FUSE_THRESHOLD
  voiceLog("matching:thresholdSelected", { threshold })

  const fuse = new Fuse(contacts, {
    keys: ["name"],
    threshold,
    includeScore: true,
    ignoreLocation: true,
  })

  // 1. Fuse.js ile aday listesi oluştur
  const fuseResults = fuse.search(candidateName)
  voiceLog("matching:fuseResults", {
    count: fuseResults.length,
    results: fuseResults.slice(0, 10).map((r) => ({
      id: r.item.id,
      name: r.item.name,
      rawScore: r.score ?? null,
    })),
  })

  if (fuseResults.length === 0) {
    voiceLog("matching:noResults")
    return []
  }

  // 2. Fuse sonuçlarını temizlenen metinle doğrudan karşılaştır
  const query = candidateName.toLowerCase().trim()
  const directMatches: MatchResult[] = []

  for (const result of fuseResults) {
    const name = result.item.name.toLowerCase().trim()
    let score: number | null = null

    if (name === query) {
      // Birebir eşleşme: "emin" === "emin"
      score = 1.0
    } else if (name.startsWith(query)) {
      // Kişi adı sorguyla başlıyor: "emine" ← "emin"
      score = 0.90 + (query.length / name.length) * 0.09
    } else if (query.startsWith(name)) {
      // Sorgu kişi adıyla başlıyor: "mehmet ali" ← "mehmet"
      score = 0.80 + (name.length / query.length) * 0.09
    } else if (name.includes(query)) {
      // Kişi adı sorguyu içeriyor: "sülemin" ← "emin"
      score = 0.70 + (query.length / name.length) * 0.09
    } else if (query.includes(name)) {
      // Sorgu kişi adını içeriyor
      score = 0.60 + (name.length / query.length) * 0.09
    }

    if (score !== null) {
      directMatches.push({
        contact: result.item,
        score,
        confidence: score >= CONFIDENCE.HIGH ? "high" : "medium",
      })
    }
  }

  voiceLog("matching:directComparison", {
    directCount: directMatches.length,
    fuseCount: fuseResults.length,
  })

  // 3. Direkt eşleşme varsa onu kullan, yoksa Fuse sonuçlarına düş
  let candidates: MatchResult[]

  if (directMatches.length > 0) {
    candidates = directMatches.sort((a, b) => b.score - a.score)
    voiceLog("matching:usingDirectMatches", { count: candidates.length })
  } else {
    candidates = fuseResults
      .map((result) => {
        const score = 1 - (result.score ?? 1)
        let confidence: MatchResult["confidence"]
        if (score >= CONFIDENCE.HIGH) confidence = "high"
        else if (score >= CONFIDENCE.MEDIUM) confidence = "medium"
        else confidence = "low"
        return { contact: result.item, score, confidence }
      })
      .filter((m) => m.confidence !== "low")
      .sort((a, b) => b.score - a.score)
    voiceLog("matching:usingFuseFallback", { count: candidates.length })
  }

  // 4. Son filtreleme: en iyiden çok uzak olanları ele + max aday limiti
  const filtered: MatchResult[] = []
  for (const match of candidates) {
    if (
      filtered.length === 0 ||
      filtered[0].score - match.score <= MULTI_CANDIDATE_DIFF
    ) {
      filtered.push(match)
    }
  }

  const final = filtered.slice(0, MAX_CANDIDATES)

  voiceLog("matching:finalCandidates", {
    count: final.length,
    candidates: final.map((item) => ({
      id: item.contact.id,
      name: item.contact.name,
      confidence: item.confidence,
      score: Number(item.score.toFixed(3)),
    })),
  })

  return final
}
