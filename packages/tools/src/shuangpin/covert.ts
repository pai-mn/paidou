import type { ParsedPinyin } from '#/types.ts'
import { parsePinyin } from '#/pinyin/index.ts'
import { pinyinInitials } from '#/pinyin/constants.ts'
import type { SpMode } from '#/shuangpin/constants.ts'
import { getShuangpinMaps } from '#/shuangpin/constants.ts'

export function toShuangpin(pinyin: string | ParsedPinyin, spMode: SpMode) {
  pinyin = parsePinyin(pinyin)
  const base = pinyin.base
  const initial = pinyinInitials.find((i) => base.startsWith(i)) || ''
  const final = base.slice(initial.length)

  const maps = getShuangpinMaps(spMode)

  const a = maps.initials[initial] || initial
  const b = maps.finals[final] || final

  return a + b
}
