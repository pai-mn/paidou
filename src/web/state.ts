import { useQuery } from '@tanstack/vue-query'
import { fetchDailyGame } from '#/web/api/game.ts'
import type { DailyGame } from '#/shared/api-types.ts'
import { TRIES_LIMIT, WORD_LENGTH } from '#/shared/game-constants.ts'
import type { MatchType, ParsedChar } from '#/web/logic/types.ts'
import { cachePinyin } from '#/web/logic/pinyin.ts'
import { parseWord as _parseWord, testAnswer as _testAnswer, checkPass, numberToHanzi } from '#/web/logic/utils.ts'
import { useNumberTone as _useNumberTone, inputMode, meta, spMode, tries } from '#/web/storage.ts'

export const isIOS =
  /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
export const isMobile = isIOS || /iPad|iPhone|iPod|Android|Phone|webOS/i.test(navigator.userAgent)
export const now = useNow({ interval: 1000 })
export const isDark = useDark()
export const useMask = ref(false)

export const useNumberTone = computed(() => {
  if (inputMode.value === 'sp') return true
  if (inputMode.value === 'zy') return false
  return _useNumberTone.value
})

export const isDev = Boolean(import.meta.hot)
const remoteGame = shallowRef<Readonly<Ref<DailyGame | undefined>>>()
const remoteGamePending = shallowRef<Readonly<Ref<boolean>>>()
export const dayNo = computed(() => remoteGame.value?.value?.day ?? 0)
export const dayNoHanzi = computed(() => `${numberToHanzi(dayNo.value)}日`)
export const gameDate = computed(() => remoteGame.value?.value?.date ?? '')
export const nextGameAt = computed(() => remoteGame.value?.value?.nextGameAt ?? '')
export const serverClockOffset = computed(() => {
  const serverTime = remoteGame.value?.value?.serverTime
  return serverTime ? new Date(serverTime).getTime() - Date.now() : 0
})
export const answer = computed(() => remoteGame.value?.value?.answer ?? { word: '', hint: '' })
export const isAnswerLoading = computed(() => remoteGamePending.value?.value ?? true)

export function initializeAnswerQuery() {
  const query = useQuery({
    queryKey: ['game'],
    queryFn: async ({ signal }) => {
      const game = await fetchDailyGame(signal)
      cachePinyin(game.answer.word, game.answer.pinyin)
      return game
    },
    refetchInterval: 60_000,
  })
  remoteGame.value = query.data
  remoteGamePending.value = query.isPending

  return query
}

export const hint = computed(() => answer.value.hint)
export const parsedAnswer = computed(() => parseWord(answer.value.word))

export const isPassed = computed(() => {
  if (!answer.value.word) return false
  return (
    meta.value.passed || (tries.value.length && checkPass(testAnswer(parseWord(tries.value[tries.value.length - 1]))))
  )
})
export const isFailed = computed(() => !isPassed.value && tries.value.length >= TRIES_LIMIT)
export const isFinished = computed(() => isPassed.value || meta.value.answer)

export function parseWord(word: string, _ans = answer.value.word, mode = inputMode.value, spM = spMode.value) {
  return _parseWord(word, _ans, mode, spM)
}

export function testAnswer(word: ParsedChar[], ans = parsedAnswer.value) {
  return _testAnswer(word, ans)
}

export const parsedTries = computed(() =>
  tries.value.map((i) => {
    const word = parseWord(i)
    const result = testAnswer(word)
    return {
      word,
      result,
    }
  }),
)

export function getSymbolState(symbol?: string | number, key?: '_1' | '_2' | 'tone') {
  const results: MatchType[] = []
  for (const t of parsedTries.value) {
    for (let i = 0; i < WORD_LENGTH; i++) {
      const w = t.word[i]
      const r = t.result[i]
      if (key) {
        if (w[key] === symbol) results.push(r[key])
      } else {
        if (w._1 === symbol) results.push(r._1)
        if (w._2 === symbol) results.push(r._2)
        if (w._3 === symbol) results.push(r._3)
      }
    }
  }
  if (results.includes('exact')) return 'exact'
  if (results.includes('misplaced')) return 'misplaced'
  if (results.includes('none')) return 'none'
  return null
}
