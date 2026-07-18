import type { ApiError, ApiSuccess, IdiomValidation } from '#/shared/api-types.ts'

export async function validateIdioms(words: string[], signal?: AbortSignal): Promise<IdiomValidation> {
  const response = await fetch('/api/idioms/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words }),
    signal,
  })
  const payload = (await response.json()) as ApiSuccess<IdiomValidation> | ApiError

  if (!response.ok || 'error' in payload)
    throw new Error('error' in payload ? payload.error.message : 'Failed to validate idioms')

  return payload.data
}
