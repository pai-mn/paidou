import { getPinyinRaw, toSimplified } from '@hankit/tools'
import PolyphonesRaw from '#shared/data/polyphones.json'

const polyphones = PolyphonesRaw as Record<string, string>

export function getPinyin(word: string) {
  const simplified = toSimplified(word)
  const parts = polyphones[word]?.split(/\s+/g) ?? polyphones[simplified]?.split(/\s+/g) ?? getPinyinRaw(simplified)
  // Normalize ü to v after y, j, q, and x so all input modes use the same representation.
  return parts.map((part) => part.replace(/^(y|j|q|x)u([a-z]*[0-9]?)$/g, '$1v$2'))
}
