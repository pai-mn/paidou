import { initialized, markEnd, markStart, meta, pauseTimer } from '#/web/storage.ts'
import { showCheatSheet, showHelp } from '#/web/modal-state.ts'
import { answer, dayNo, gameDate, isDev, isFinished, isPassed } from '#/web/state.ts'
import { t } from '#/web/i18n.ts'
import { tryFixAnswer } from '#/web/logic/answer-fix.ts'

useTitle(computed(() => `${t('name')} - ${t('description')}`))

if (!initialized.value) showHelp.value = true

watchEffect(() => {
  if (isPassed.value) meta.value.passed = true
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
    if (isDev) console.log(`D${dayNo.value}`, gameDate.value, word, hint)
  },
  { immediate: true },
)
