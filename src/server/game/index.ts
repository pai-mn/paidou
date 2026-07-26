import { getBeijingGameDate } from '#/server/game/date.ts'
import { answerCandidates } from '#/server/game/answers.ts'
import { avoidBoundaryRepeat, seedShuffle } from '#/server/game/utils.ts'
import { getWordPinyin } from '#/server/pronunciations.ts'
import { getHint } from '#/shared/game.ts'
import type { DailyGame } from '#/shared/api-types.ts'

const SCHEDULE_VERSION = 'paidou-v1'
const GAME_DAY_OFFSET = 1
const DAY_MS = 86_400_000
const cycleCache = new Map<number, [string, string][]>()

function getCycle(cycle: number): [string, string][] {
  const cached = cycleCache.get(cycle)
  if (cached) return cached

  const answers = seedShuffle([...answerCandidates], `${SCHEDULE_VERSION}-${cycle}`)
  if (cycle > 0) {
    const previousAnswer = getCycle(cycle - 1).at(-1)?.[0]
    avoidBoundaryRepeat(answers, previousAnswer)
  }

  cycleCache.set(cycle, answers)
  return answers
}

export function getAnswerOfDay(day: number) {
  if (!Number.isSafeInteger(day) || day < 1) throw new RangeError('Day must be a positive integer')

  const zeroBasedDay = day - 1
  const cycle = Math.floor(zeroBasedDay / answerCandidates.length)
  const index = zeroBasedDay % answerCandidates.length
  const answer = getCycle(cycle)[index]
  const [word = '', hint = ''] = answer

  return {
    word,
    hint: hint || getHint(word),
  }
}

export function getDailyGame(now = new Date()): DailyGame {
  const { nextGameAt } = getBeijingGameDate(now)
  const { date, day } = getBeijingGameDate(new Date(now.getTime() + GAME_DAY_OFFSET * DAY_MS))
  const answer = getAnswerOfDay(day)

  return {
    date,
    day,
    nextGameAt,
    serverTime: now.toISOString(),
    answer: {
      ...answer,
      pinyin: getWordPinyin(answer.word),
    },
  }
}
