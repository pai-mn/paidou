import seedrandom from 'seedrandom'

export function getHint(word: string) {
  const characters = Array.from(word)
  return characters[Math.floor(seedrandom(word)() * characters.length)]
}
