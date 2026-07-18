import { toSimplified } from '@hankit/tools'
import PolyphonesRaw from '#shared/data/polyphones.json'
import IdiomsRaw from '#shared/data/idioms.txt?raw'

const idioms = new Set(
  IdiomsRaw.split('\n')
    .map((i) => i.trim())
    .filter(Boolean),
)
const polyphones = PolyphonesRaw as Record<string, string>

export function getIdiom(word: string): [string, string | undefined] | undefined {
  const simplified = toSimplified(word)
  if (polyphones[word]) return [word, polyphones[word]]
  if (polyphones[simplified]) return [word, polyphones[simplified]]
  if (idioms.has(word)) return [word, undefined]
  if (idioms.has(simplified)) return [simplified, undefined]
  return undefined
}
