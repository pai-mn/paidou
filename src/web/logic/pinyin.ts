import { toSimplified } from '#/shared/tools/convert.ts'
import { getPinyinRaw } from '#/shared/tools/pinyin/get.ts'
import { normalizePinyinSyllable } from '#/shared/tools/pinyin/normalize.ts'

const pronunciationCache = new Map<string, string[]>()

export function cachePinyin(word: string, pinyin: string[]) {
  pronunciationCache.set(word, pinyin)
  pronunciationCache.set(toSimplified(word), pinyin)
}

export function getPinyin(word: string) {
  const simplified = toSimplified(word)
  const parts = pronunciationCache.get(word) ?? pronunciationCache.get(simplified) ?? getPinyinRaw(simplified)
  return parts.map(normalizePinyinSyllable)
}
