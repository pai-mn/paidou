import { pinyin } from 'pinyin-pro'
import { parsePinyin } from '#/shared/tools/pinyin/parse.ts'

export function getPinyinRaw(text: string) {
  return pinyin(text, { toneType: 'num', type: 'array' })
}

export function getPinyin(text: string) {
  return getPinyinRaw(text).map((i) => parsePinyin(i))
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('pinyin', () => {
    it('getPinyin', () => {
      expect(
        getPinyin('輸入繁體字進行轉換')
          .map((i) => i.base + i.tone)
          .join(' '),
      ).toMatchInlineSnapshot('"shu1 ru4 fan2 ti3 zi4 jin4 xing2 zhuan3 huan4"')
    })
  })
}
