import { PHONETIC_CHAR_MAP, PHONETIC_PATTERN_MAP } from "./nlpConstants"

/**
 * Tek kelimeye karakter bazlı fonetik dönüşüm uygular.
 * Kürtçe Latin karakterlerini Türkçe karşılıklarına çevirir.
 */
export function applyCharMap(word: string): string {
  let result = ""
  for (const char of word) {
    const lower = char.toLowerCase()
    result += PHONETIC_CHAR_MAP[lower] ?? lower
  }
  return result
}

/**
 * Metne regex bazlı kalıp dönüşümlerini uygular.
 * Yaygın Kürtçe isim yazılışlarını Türkçe karşılıklarına çevirir.
 */
export function applyPatternMap(text: string): string {
  let result = text
  for (const [pattern, replacement] of PHONETIC_PATTERN_MAP) {
    result = result.replace(pattern, replacement)
  }
  return result
}

/**
 * Tam fonetik normalizasyon: önce pattern, sonra karakter dönüşümü.
 * Küçük harfe çevrilmiş, boşlukları düzenlenmiş normalize string döndürür.
 */
export function phoneticNormalize(text: string): string {
  const lowered = text.toLowerCase().trim()
  const patternApplied = applyPatternMap(lowered)
  const charApplied = applyCharMap(patternApplied)
  return charApplied.replace(/\s+/g, " ").trim()
}
