import { getIdiom } from '#/server/idioms/idioms.ts'

export function checkValidIdiom(word: string, strict = false) {
  if (!strict) return true
  if (Array.from(word).length !== 4 || Array.from(word).some((character) => !/\p{Script=Han}/u.test(character)))
    return false
  return !!getIdiom(word)
}
