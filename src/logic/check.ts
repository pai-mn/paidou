import { WORD_LENGTH } from '#/logic/constants.ts'
import { getIdiom } from '#/logic/idioms.ts'

export function filterNonChineseChars(input: string) {
  return Array.from(input)
    .filter((i) => /\p{Script=Han}/u.test(i))
    .slice(0, WORD_LENGTH)
    .join('')
}

export function checkValidIdiom(word: string, strict = false) {
  if (!strict) return true
  return !!getIdiom(word)
}
