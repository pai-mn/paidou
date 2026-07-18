import { expect, it } from 'vitest'
import { getAnswerOfDay } from '#/answers/index.ts'
import { answers } from '#/answers/list.ts'
import { getPinyin } from '#/logic/index.ts'

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

it('reuses prepared answers after the fixed schedule ends', () => {
  const boundaryAnswer = getAnswerOfDay(answers.length)
  const futureAnswer = getAnswerOfDay(answers.length + 1000)

  expect(boundaryAnswer.word).not.toBe('')
  expect(futureAnswer.word).not.toBe('')
  expect(getAnswerOfDay(answers.length + 1000)).toEqual(futureAnswer)
})
