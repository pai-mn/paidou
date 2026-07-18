import seedrandom from 'seedrandom'

export function getHint(word: string) {
  return word[Math.floor(seedrandom(word)() * word.length)]
}
