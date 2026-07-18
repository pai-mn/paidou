import toPhonetics from '#/map/toPhonetics.json'
import type { ParsedPinyin } from '#/types.ts'
import { getPhoneticPosition } from '#/pinyin/phonetic.ts'
import { parsePinyin } from '#/pinyin/parse.ts'

export function pinyinToNumberStyle(pinyin: string | ParsedPinyin) {
  pinyin = parsePinyin(pinyin)
  return pinyin.base + (pinyin.tone || '')
}

export function pinyinToToneStyle(input: string | ParsedPinyin) {
  const pinyin = parsePinyin(input)
  const pos = getPhoneticPosition(pinyin)

  if (pos == null) return pinyin.base

  const toneBaseChar = pinyin.base[pos]
  const withPhonetic = (pinyin.tone ? (toPhonetics as any)[toneBaseChar][pinyin.tone - 1] : null) || toneBaseChar
  return Array.from(pinyin.base)
    .map((i, index) => (index === pinyin.phoneticPos ? withPhonetic : i))
    .join('')
}
