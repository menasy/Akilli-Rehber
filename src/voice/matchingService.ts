import Fuse from "fuse.js"
import {
  FUSE_THRESHOLD,
  CONFIDENCE,
  MAX_CANDIDATES,
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

  const results = fuse.search(candidateName)
  voiceLog("matching:fuseResults", {
    count: results.length,
    results: results.slice(0, MAX_CANDIDATES).map((result) => ({
      id: result.item.id,
      name: result.item.name,
      rawScore: result.score ?? null,
    })),
  })

  const mapped: MatchResult[] = results
    .map((result) => {
      // Fuse score: 0 = perfect match, 1 = no match
      const score = 1 - (result.score ?? 1)

      let confidence: MatchResult["confidence"]
      if (score >= CONFIDENCE.HIGH) {
        confidence = "high"
      } else if (score >= CONFIDENCE.MEDIUM) {
        confidence = "medium"
      } else {
        confidence = "low"
      }

      return {
        contact: result.item,
        score,
        confidence,
      }
    })
    .filter((m) => m.confidence !== "low")
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CANDIDATES)

  voiceLog("matching:finalCandidates", {
    count: mapped.length,
    candidates: mapped.map((item) => ({
      id: item.contact.id,
      name: item.contact.name,
      confidence: item.confidence,
      score: Number(item.score.toFixed(3)),
    })),
  })

  return mapped
}
