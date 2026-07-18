import seedrandom from 'seedrandom'

export function seedShuffle<T>(array: T[], seed: string): T[] {
  const rng = seedrandom(seed)
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(rng() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

export function avoidBoundaryRepeat<T extends [string, ...unknown[]]>(answers: T[], previousAnswer?: string) {
  if (answers[0]?.[0] !== previousAnswer) return

  const swapIndex = answers.findIndex(([word]) => word !== previousAnswer)
  if (swapIndex > 0) [answers[0], answers[swapIndex]] = [answers[swapIndex], answers[0]]
}
