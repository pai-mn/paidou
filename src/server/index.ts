import { app } from '#server/app.ts'

const port = Number(process.env.PORT || 8787)

console.log(`Paidou server listening on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
