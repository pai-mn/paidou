import { afterEach, describe, expect, it, vi } from 'vitest'
import { app } from '#/server/app.ts'

afterEach(() => vi.useRealTimers())

describe('game API', () => {
  it('returns a structured daily game', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-18T08:00:00.000Z'))

    const response = await app.request('/api/game')
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(payload).toMatchObject({
      data: {
        day: 1660,
        date: '2026-07-18',
        nextGameAt: '2026-07-18T16:00:00.000Z',
        serverTime: '2026-07-18T08:00:00.000Z',
        answer: {
          word: expect.stringMatching(/^.{4}$/u),
          hint: expect.any(String),
          pinyin: expect.arrayContaining([expect.any(String)]),
        },
      },
    })
  })

  it('does not accept a client-selected day', async () => {
    const response = await app.request('/api/game/1660')
    expect(response.status).toBe(404)
  })

  it('returns pronunciations in a structured batch response', async () => {
    const response = await app.request('/api/pronunciations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: ['云淡风轻', '云淡风淡'] }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      data: {
        pronunciations: {
          云淡风淡: expect.any(Array),
          云淡风轻: expect.any(Array),
        },
      },
    })
  })

  it('rejects malformed pronunciation requests', async () => {
    const response = await app.request('/api/pronunciations', {
      method: 'POST',
      body: JSON.stringify({ words: '云淡风轻' }),
    })
    expect(response.status).toBe(400)
  })

  it('returns pronunciations for arbitrary input', async () => {
    const response = await app.request('/api/pronunciations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: ['云淡风轻云', 'test'] }),
    })

    expect(await response.json()).toMatchObject({
      data: {
        pronunciations: {
          云淡风轻云: expect.any(Array),
          test: expect.any(Array),
        },
      },
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
