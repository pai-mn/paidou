import { toSimplified } from '#/shared/tools/convert.ts'
import { getPinyinRaw } from '#/shared/tools/pinyin/get.ts'
import IdiomsRaw from '#/server/data/idioms.csv?raw'
import PolyphonesRaw from '#/server/data/polyphones.csv?raw'
import { parseCsv } from '#/server/data/csv.ts'

interface IdiomRow {
  word: string
}

interface PolyphoneRow extends IdiomRow {
  pinyin: string
}

const idiomRows = parseCsv<IdiomRow>(IdiomsRaw)
const polyphoneRows = parseCsv<PolyphoneRow>(PolyphonesRaw)
const idioms = new Set(idiomRows.map(({ word }) => word))
const polyphones = new Map(polyphoneRows.map(({ word, pinyin }) => [word, pinyin]))

if (idioms.size !== idiomRows.length || idiomRows.some(({ word }) => !word))
  throw new Error('Idiom CSV contains an empty or duplicate word')
if (polyphones.size !== polyphoneRows.length || polyphoneRows.some(({ word, pinyin }) => !word || !pinyin))
  throw new Error('Polyphone CSV contains an empty or duplicate entry')

export function getIdiom(word: string): [string, string | undefined] | undefined {
  const simplified = toSimplified(word)
  if (polyphones.has(word)) return [word, polyphones.get(word)]
  if (polyphones.has(simplified)) return [word, polyphones.get(simplified)]
  if (idioms.has(word)) return [word, undefined]
  if (idioms.has(simplified)) return [simplified, undefined]
  return undefined
}

export function getWordPinyin(word: string): string[] {
  const simplified = toSimplified(word)
  const customPinyin = polyphones.get(word) ?? polyphones.get(simplified)
  return customPinyin?.split(/\s+/) ?? getPinyinRaw(simplified)
}
