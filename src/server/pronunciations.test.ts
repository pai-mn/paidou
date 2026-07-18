import { describe, expect, it } from 'vitest'
import { getWordPinyin } from '#/server/pronunciations.ts'

describe('word pronunciations', () => {
  it('returns no syllables for an empty word', () => {
    expect(getWordPinyin('')).toEqual([])
  })

  it('returns valid pinyin for supported characters', () => {
    expect(getWordPinyin('天地玄黄')).toEqual(['tian1', 'di4', 'xvan2', 'huang2'])
    expect(getWordPinyin('屡试不爽')).toEqual(['lv3', 'shi4', 'bu4', 'shuang3'])
  })

  it('uses an empty pronunciation for unsupported characters', () => {
    expect(getWordPinyin('甲𠀀乙丙')).toEqual(['jia3', '', 'yi3', 'bing3'])
  })
})
