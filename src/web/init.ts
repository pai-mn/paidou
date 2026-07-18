import { initialized, markEnd, markStart, meta, pauseTimer } from '#/storage.ts'
import { showCheatSheet, showHelp } from '#/modal-state.ts'
import { answer, dayNo, daySince, isDev, isFinished, isPassed } from '#/state.ts'
import { t } from '#/i18n.ts'
import { START_DATE } from '#shared/game-constants.ts'
import { tryFixAnswer } from '#/logic/answer-fix.ts'

useTitle(computed(() => `${t('name')} - ${t('description')}`))

if (!initialized.value) showHelp.value = true

watchEffect(() => {
  if (isPassed.value) meta.value.passed = true
})

watch(daySince, (n, o) => {
  // on day changed
  if (o === dayNo.value && isFinished.value) dayNo.value = n
})

watch(
  [isFinished, meta],
  () => {
    if (isFinished.value) markEnd()
    // sendAnalytics()
  },
  { flush: 'post' },
)

watch(
  isFinished,
  (v) => {
    if (v) showCheatSheet.value = false
  },
  { flush: 'post' },
)

const visible = useDocumentVisibility()

let leaveTime = 0
const REFRESH_TIME = 1000 * 60 * 60 * 3 // 3 hours
watchEffect(
  () => {
    if (visible.value === 'visible') {
      // left for a long while, refresh the page for updates
      if (leaveTime && Date.now() - leaveTime > REFRESH_TIME) location.reload()

      // restart timer
      if (meta.value.duration) markStart()
    } else if (visible.value === 'hidden') {
      leaveTime = Date.now()
      pauseTimer()
    }
  },
  { flush: 'post' },
)

watch(
  answer,
  ({ word, hint }) => {
    if (!word) return
    tryFixAnswer(dayNo.value, word)
    if (isDev || import.meta.hot) {
      const theDate = new Date(+START_DATE + dayNo.value * 86400000)
      console.log(`D${dayNo.value}`, theDate.toLocaleDateString(), word, hint)
    }
  },
  { immediate: true },
)
