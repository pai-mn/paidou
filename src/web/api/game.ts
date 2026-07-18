import type { ApiError, ApiSuccess, DailyGame } from '#shared/api-types.ts'

export async function fetchDailyGame(day: number, signal?: AbortSignal): Promise<DailyGame> {
  const response = await fetch(`/api/game/${day}`, { signal })
  const payload = (await response.json()) as ApiSuccess<DailyGame> | ApiError

  if (!response.ok || 'error' in payload)
    throw new Error('error' in payload ? payload.error.message : `Failed to load game ${day}`)

  return payload.data
}
