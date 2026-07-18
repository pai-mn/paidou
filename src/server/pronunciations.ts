import { toSimplified } from '#/shared/tools/convert.ts'
import { getPinyinRaw } from '#/shared/tools/pinyin/get.ts'
import { normalizePinyinSyllable } from '#/shared/tools/pinyin/normalize.ts'
import { toZhuyin } from '#/shared/tools/zhuyin/convert.ts'
import PolyphonesRaw from '#/server/data/polyphones.csv?raw'
import { parseCsv } from '#/server/data/csv.ts'

interface PolyphoneRow {
  word: string
  pinyin: string
}

const polyphoneRows = parseCsv<PolyphoneRow>(PolyphonesRaw)
const polyphones = new Map(polyphoneRows.map(({ word, pinyin }) => [word, pinyin]))

if (polyphones.size !== polyphoneRows.length || polyphoneRows.some(({ word, pinyin }) => !word || !pinyin))
  throw new Error('Polyphone CSV contains an empty or duplicate entry')

function isValidPinyinSyllable(pinyin: string) {
  if (!/^[a-z]+[0-4]?$/i.test(pinyin)) return false
  try {
    toZhuyin(pinyin, false)
    return true
  } catch {
    return false
  }
}

function parseWordPinyin(pinyin: string | string[]) {
  const syllables = Array.isArray(pinyin) ? pinyin : pinyin ? pinyin.split(/\s+/) : []
  return syllables.map(normalizePinyinSyllable).map((syllable) => (isValidPinyinSyllable(syllable) ? syllable : ''))
}

const invalidPolyphoneIndex = polyphoneRows.findIndex(({ word, pinyin }) => {
  const syllables = parseWordPinyin(pinyin)
  return syllables.length !== Array.from(word).length || syllables.some((syllable) => !syllable)
})
if (invalidPolyphoneIndex >= 0)
  throw new Error(`Polyphone at row ${invalidPolyphoneIndex + 2} must provide one valid pinyin syllable per character`)

export function getWordPinyin(word: string): string[] {
  const simplified = toSimplified(word)
  const customPinyin = polyphones.get(word) ?? polyphones.get(simplified)
  return parseWordPinyin(customPinyin ?? getPinyinRaw(simplified))
}
