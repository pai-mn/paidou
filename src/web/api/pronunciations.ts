import type { ApiError, ApiSuccess, Pronunciations } from '#/shared/api-types.ts'

export async function getPronunciations(words: string[], signal?: AbortSignal): Promise<Pronunciations> {
  const response = await fetch('/api/pronunciations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words }),
    signal,
  })
  const payload = (await response.json()) as ApiSuccess<Pronunciations> | ApiError

  if (!response.ok || 'error' in payload)
    throw new Error('error' in payload ? payload.error.message : 'Failed to load pronunciations')

  return payload.data
}
