import { describe, expect, it } from 'vitest'
import { getBeijingGameDate } from '#/server/game/date.ts'
import { getAnswerOfDay } from '#/server/game/index.ts'
import { answerCandidates } from '#/server/game/answers.ts'
import { getHint } from '#/shared/game.ts'

describe('daily answer schedule', () => {
  it('contains non-empty unique candidates', () => {
    const words = answerCandidates.map(([word]) => word)

    expect(words.length).toBeGreaterThan(0)
    expect(words.every(Boolean)).toBe(true)
    expect(new Set(words).size).toBe(words.length)
  })

  it('uses every candidate exactly once per cycle', () => {
    for (let cycle = 0; cycle < 3; cycle++) {
      const firstDay = cycle * answerCandidates.length + 1
      const words = answerCandidates.map((_, index) => getAnswerOfDay(firstDay + index).word)

      expect(new Set(words)).toEqual(new Set(answerCandidates.map(([word]) => word)))
    }
  })

  it('is deterministic and avoids repetition across cycle boundaries when possible', () => {
    const lastDay = answerCandidates.length

    expect(getAnswerOfDay(100)).toEqual(getAnswerOfDay(100))
    if (answerCandidates.length > 1) expect(getAnswerOfDay(lastDay).word).not.toBe(getAnswerOfDay(lastDay + 1).word)
  })

  it('rejects invalid day numbers', () => {
    expect(() => getAnswerOfDay(0)).toThrow(RangeError)
    expect(() => getAnswerOfDay(1.5)).toThrow(RangeError)
  })
})

describe('answer hints', () => {
  it('selects a complete Unicode character', () => {
    const word = '甲𠀀乙丙'
    const hint = getHint(word)

    expect(Array.from(word)).toContain(hint)
    expect(Array.from(hint)).toHaveLength(1)
  })
})

describe('Beijing game date', () => {
  it('changes at midnight in Asia/Shanghai', () => {
    const beforeMidnight = getBeijingGameDate(new Date('2026-07-19T15:59:59.999Z'))
    const atMidnight = getBeijingGameDate(new Date('2026-07-19T16:00:00.000Z'))

    expect(beforeMidnight.date).toBe('2026-07-19')
    expect(atMidnight.date).toBe('2026-07-20')
    expect(atMidnight.day).toBe(beforeMidnight.day + 1)
    expect(beforeMidnight.nextGameAt).toBe('2026-07-19T16:00:00.000Z')
  })

  it('numbers the Paidou launch date as day one', () => {
    expect(getBeijingGameDate(new Date('2026-07-17T16:00:00.000Z'))).toMatchObject({ date: '2026-07-18', day: 1 })
  })
})
