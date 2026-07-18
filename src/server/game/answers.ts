import AnswersRaw from '#/server/data/answers.csv?raw'
import { parseCsv } from '#/server/data/csv.ts'
import { getWordPinyin } from '#/server/pronunciations.ts'
import { WORD_LENGTH } from '#/shared/game-constants.ts'
import { isChineseCharacter } from '#/shared/tools/hanzi/filter.ts'

interface AnswerRow {
  word: string
  hint: string
}

const rows = parseCsv<AnswerRow>(AnswersRaw)
const seen = new Set<string>()

export const answerCandidates = rows.map(({ word, hint }, index): [string, string] => {
  const characters = Array.from(word)
  const hintCharacters = Array.from(hint)
  if (characters.length !== WORD_LENGTH || characters.some((character) => !isChineseCharacter(character)))
    throw new Error(`Answer at row ${index + 2} must contain exactly ${WORD_LENGTH} Han characters`)
  if (seen.has(word)) throw new Error(`Duplicate answer at row ${index + 2}: ${word}`)
  if (hint && (hintCharacters.length !== 1 || !isChineseCharacter(hintCharacters[0]) || !characters.includes(hint)))
    throw new Error(`Hint at row ${index + 2} must be a single Han character included in ${word}`)
  const pinyin = getWordPinyin(word)
  if (pinyin.length !== characters.length || pinyin.some((syllable) => !syllable))
    throw new Error(`Answer at row ${index + 2} has unsupported pinyin; add an override to polyphones.csv: ${word}`)

  seen.add(word)
  return [word, hint]
})

if (!answerCandidates.length) throw new Error('Answer CSV must not be empty')
