import { expect, it } from 'vitest'
import { getAnswerOfDay } from '#/server/game/index.ts'
import { answerCandidates } from '#/server/game/answers.ts'
import { getPinyin } from '#/web/logic/pinyin.ts'

it('getPinyin', () => {
  expect(getPinyin('自怨自艾')).toMatchInlineSnapshot(`
    [
      "zi4",
      "yvan4",
      "zi4",
      "yi4",
    ]
  `)
})

it('keeps scheduled answers stable across cycles', () => {
  const boundaryAnswer = getAnswerOfDay(answerCandidates.length)
  const futureDay = answerCandidates.length + 1000
  const futureAnswer = getAnswerOfDay(futureDay)

  expect(boundaryAnswer.word).not.toBe('')
  expect(futureAnswer.word).not.toBe('')
  expect(getAnswerOfDay(futureDay)).toEqual(futureAnswer)
})
