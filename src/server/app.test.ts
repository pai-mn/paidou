import { describe, expect, it } from 'vitest'
import { app } from '#server/app.ts'

describe('game API', () => {
  it('returns a structured daily game', async () => {
    const response = await app.request('/api/game/1660')
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toMatchObject({
      data: {
        day: 1660,
        answer: {
          word: expect.stringMatching(/^.{4}$/u),
          hint: expect.any(String),
        },
      },
    })
  })

  it('rejects invalid days', async () => {
    const response = await app.request('/api/game/not-a-day')
    expect(response.status).toBe(400)
  })

  it('validates idioms in a structured batch response', async () => {
    const response = await app.request('/api/idioms/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: ['云淡风轻', '云淡风淡'] }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      data: { validity: { 云淡风轻: true, 云淡风淡: false } },
    })
  })

  it('rejects malformed idiom validation requests', async () => {
    const response = await app.request('/api/idioms/validate', {
      method: 'POST',
      body: JSON.stringify({ words: '云淡风轻' }),
    })
    expect(response.status).toBe(400)
  })

  it('rejects non-idiom input without looking it up', async () => {
    const response = await app.request('/api/idioms/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: ['云淡风轻云', 'test'] }),
    })

    expect(await response.json()).toEqual({
      data: { validity: { 云淡风轻云: false, test: false } },
    })
  })

  it('returns a structured 404 for unknown API routes', async () => {
    const response = await app.request('/api/unknown')
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: { code: 'NOT_FOUND', message: 'API endpoint not found' },
    })
  })
})
