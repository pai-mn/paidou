import AnswersRaw from '#/server/data/answers.csv?raw'
import { parseCsv } from '#/server/data/csv.ts'
import { checkValidIdiom } from '#/server/idioms/check.ts'

interface AnswerRow {
  word: string
  hint: string
}

const rows = parseCsv<AnswerRow>(AnswersRaw)
const seen = new Set<string>()

export const answerCandidates = rows.map(({ word, hint }, index): string[] => {
  if (Array.from(word).length !== 4 || Array.from(word).some((character) => !/\p{Script=Han}/u.test(character)))
    throw new Error(`Answer at row ${index + 2} must contain exactly four Han characters`)
  if (seen.has(word)) throw new Error(`Duplicate answer at row ${index + 2}: ${word}`)
  if (hint && !word.includes(hint)) throw new Error(`Hint at row ${index + 2} is not included in ${word}`)
  if (!checkValidIdiom(word, true)) throw new Error(`Answer at row ${index + 2} is not a valid idiom: ${word}`)

  seen.add(word)
  return [word, hint]
})

if (!answerCandidates.length) throw new Error('Answer CSV must not be empty')
