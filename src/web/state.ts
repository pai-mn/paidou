import { breakpointsTailwind } from '@vueuse/core'
import { useQuery } from '@tanstack/vue-query'
import { fetchDailyGame } from '#/api/game.ts'
import type { DailyGame } from '#shared/api-types.ts'
import { START_DATE, TRIES_LIMIT, WORD_LENGTH } from '#shared/game-constants.ts'
import { getHint } from '#shared/game.ts'
import type { MatchType, ParsedChar } from '#/logic/types.ts'
import {
  parseWord as _parseWord,
  testAnswer as _testAnswer,
  checkPass,
  isDstObserved,
  numberToHanzi,
} from '#/logic/utils.ts'
import { useNumberTone as _useNumberTone, inputMode, meta, spMode, tries } from '#/storage.ts'

export const isIOS =
  /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
export const isMobile = isIOS || /iPad|iPhone|iPod|Android|Phone|webOS/i.test(navigator.userAgent)
export const breakpoints = useBreakpoints(breakpointsTailwind)

export const now = useNow({ interval: 1000 })
export const isDark = useDark()
export const showHint = ref(false)
export const showSettings = ref(false)
export const showHelp = ref(false)
export const showShare = ref(false)
export const showFailed = ref(false)
export const showDashboard = ref(false)
export const showVariants = ref(false)
export const showCheatSheet = ref(false)
export const showShareDialog = ref(false)
export const useMask = ref(false)

export const useNumberTone = computed(() => {
  if (inputMode.value === 'sp') return true
  if (inputMode.value === 'zy') return false
  return _useNumberTone.value
})

const params = new URLSearchParams(window.location.search)
export const isDev = import.meta.hot || params.get('dev') === 'hey'
export const daySince = useDebounce(
  computed(() => {
    // Adjust date for daylight saving time, assuming START_DATE is not in DST
    const adjustedNow = isDstObserved(now.value) ? new Date(+now.value + 3600000) : now.value
    return Math.floor((+adjustedNow - +START_DATE) / 86400000)
  }),
)
export const dayNo = ref(+(params.get('d') || daySince.value))
export const dayNoHanzi = computed(() => `${numberToHanzi(dayNo.value)}日`)
const customWord = params.get('word')
const customAnswer = customWord ? { word: customWord, hint: getHint(customWord) } : undefined
const remoteGame = shallowRef<Readonly<Ref<DailyGame | undefined>>>()
const remoteGamePending = shallowRef<Readonly<Ref<boolean>>>()

export const answer = computed(() => customAnswer ?? remoteGame.value?.value?.answer ?? { word: '', hint: '' })
export const isAnswerLoading = computed(() => !customAnswer && (remoteGamePending.value?.value ?? false))

export function initializeAnswerQuery() {
  if (customAnswer) return

  const query = useQuery({
    queryKey: computed(() => ['game', dayNo.value] as const),
    queryFn: ({ queryKey, signal }) => fetchDailyGame(queryKey[1], signal),
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
