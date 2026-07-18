import { describe, expect, it } from 'vitest'
import { avoidBoundaryRepeat } from '#/server/game/utils.ts'

describe('cycle boundaries', () => {
  it('moves a different answer to the start when possible', () => {
    const answers: [string, string][] = [
      ['风花雪月', '风'],
      ['一诺千金', '诺'],
    ]

    avoidBoundaryRepeat(answers, '风花雪月')

    expect(answers.map(([word]) => word)).toEqual(['一诺千金', '风花雪月'])
  })

  it('keeps a single-answer cycle intact', () => {
    const answers: [string, string][] = [['风花雪月', '风']]

    avoidBoundaryRepeat(answers, '风花雪月')

    expect(answers).toEqual([['风花雪月', '风']])
  })
})
