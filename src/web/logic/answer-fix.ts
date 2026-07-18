import { TRIES_LIMIT } from '#/shared/game-constants.ts'
import { history } from '#/web/storage.ts'

export function tryFixAnswer(day: number, answer: string) {
  const meta = history.value[day]
  if (!meta) return
  if (!meta.answer && !meta.failed && !meta.passed) return

  const tries = meta.tries || []
  const index = tries.indexOf(answer)
  if (index < 0 || index >= tries.length - 1) return

  const newTries = tries.slice(0, index + 1)
  meta.tries = newTries
  if (index <= TRIES_LIMIT) {
    meta.passed = true
    meta.failed = false
    meta.answer = false
  }
  meta.duration = ((meta.duration || 0) * newTries.length) / tries.length
}
