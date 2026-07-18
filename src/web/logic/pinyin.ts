import { toSimplified } from '#/shared/tools/convert.ts'
import { getPinyinRaw } from '#/shared/tools/pinyin/get.ts'

const pronunciationCache = new Map<string, string[]>()

export function cachePinyin(word: string, pinyin: string[]) {
  pronunciationCache.set(word, pinyin)
  pronunciationCache.set(toSimplified(word), pinyin)
}

export function getPinyin(word: string) {
  const simplified = toSimplified(word)
  const parts = pronunciationCache.get(word) ?? pronunciationCache.get(simplified) ?? getPinyinRaw(simplified)
  // Normalize ü to v after y, j, q, and x so all input modes use the same representation.
  return parts.map((part) => part.replace(/^(y|j|q|x)u([a-z]*[0-9]?)$/g, '$1v$2'))
}
