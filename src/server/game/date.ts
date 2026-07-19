const DAY_MS = 86_400_000
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000
const PAIDOU_START_DATE = Date.UTC(2026, 6, 18)

export interface BeijingGameDate {
  date: string
  day: number
  nextGameAt: string
}

export function getBeijingGameDate(now = new Date()): BeijingGameDate {
  const beijingTime = now.getTime() + BEIJING_OFFSET_MS
  const day = Math.floor((beijingTime - PAIDOU_START_DATE) / DAY_MS) + 1
  const nextGameAt = new Date(PAIDOU_START_DATE + day * DAY_MS - BEIJING_OFFSET_MS)

  return {
    date: new Date(beijingTime).toISOString().slice(0, 10),
    day,
    nextGameAt: nextGameAt.toISOString(),
  }
}
