const DAY_MS = 86_400_000
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000
const GAME_EPOCH_UTC = Date.UTC(2021, 11, 31)

export interface BeijingGameDate {
  date: string
  day: number
  nextGameAt: string
}

export function getBeijingGameDate(now = new Date()): BeijingGameDate {
  const beijingTime = now.getTime() + BEIJING_OFFSET_MS
  const day = Math.floor((beijingTime - GAME_EPOCH_UTC) / DAY_MS)
  const nextGameAt = new Date(GAME_EPOCH_UTC + (day + 1) * DAY_MS - BEIJING_OFFSET_MS)

  return {
    date: new Date(beijingTime).toISOString().slice(0, 10),
    day,
    nextGameAt: nextGameAt.toISOString(),
  }
}
