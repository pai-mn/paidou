import path from 'node:path'
import { Hono } from 'hono'
import { getDailyGame } from '#/server/game/index.ts'
import { getWordPinyin } from '#/server/pronunciations.ts'
import type { ApiError, ApiSuccess, DailyGame, Pronunciations } from '#/shared/api-types.ts'

export const app = new Hono()
const distDir = path.resolve(import.meta.dirname, '../../dist')

app.get('/api/health', (c) => c.json({ data: { status: 'ok' } }))

app.get('/api/game', (c) => {
  const data: DailyGame = getDailyGame()
  c.header('Cache-Control', 'no-store')
  return c.json<ApiSuccess<DailyGame>>({ data })
})

app.post('/api/pronunciations', async (c) => {
  const body = await c.req.json<{ words?: unknown }>().catch(() => undefined)
  if (!body || !Array.isArray(body.words) || body.words.some((word) => typeof word !== 'string')) {
    return c.json<ApiError>({ error: { code: 'INVALID_WORDS', message: 'Words must be an array of strings' } }, 400)
  }
  if (body.words.length > 5000) {
    return c.json<ApiError>({ error: { code: 'TOO_MANY_WORDS', message: 'At most 5000 words can be processed' } }, 400)
  }

  const pronunciations = Object.fromEntries(
    body.words.map((word) => [word, Array.from(word).length <= 16 ? getWordPinyin(word) : []]),
  )
  return c.json<ApiSuccess<Pronunciations>>({ data: { pronunciations } })
})

app.get('/api/*', (c) => c.json<ApiError>({ error: { code: 'NOT_FOUND', message: 'API endpoint not found' } }, 404))

app.get('*', async (c) => {
  let pathname: string
  try {
    pathname = decodeURIComponent(new URL(c.req.url).pathname)
  } catch {
    return c.text('Bad Request', 400)
  }
  const relativePath = pathname.replace(/^\/+/, '')
  if (!relativePath.includes('..')) {
    const asset = Bun.file(path.join(distDir, relativePath))
    if (await asset.exists()) return new Response(asset)
  }

  const index = Bun.file(path.join(distDir, 'index.html'))
  if (await index.exists()) return new Response(index, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  return c.text('Not Found', 404)
})
