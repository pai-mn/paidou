import type { ParsedPinyin } from '#/shared/tools/types.ts'
import { parsePinyin } from '#/shared/tools/pinyin/parse.ts'
import { pinyinInitials } from '#/shared/tools/pinyin/constants.ts'
import type { SpMode } from '#/shared/tools/shuangpin/constants.ts'
import { getShuangpinMaps } from '#/shared/tools/shuangpin/constants.ts'

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
