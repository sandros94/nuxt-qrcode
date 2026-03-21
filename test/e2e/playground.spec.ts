import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('playground e2e', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  })

  describe('POST /api/generate', () => {
    it('returns svg base64 for valid data', async () => {
      const data = await $fetch('/api/generate', {
        method: 'POST',
        body: { data: 'https://example.com' },
      })
      expect(data).toContain('data:image/svg+xml;base64,')
    })

    it('returns valid base64 that decodes to svg', async () => {
      const data = await $fetch('/api/generate', {
        method: 'POST',
        body: { data: 'test' },
      }) as string
      const base64 = data.replace('data:image/svg+xml;base64,', '')
      const decoded = atob(base64)
      expect(decoded).toContain('<svg')
      expect(decoded).toContain('</svg>')
    })

    it('rejects missing data with 400', async () => {
      const error = await $fetch('/api/generate', {
        method: 'POST',
        body: {},
      }).catch((e: any) => e)
      expect((error as any)?.statusCode).toBe(400)
    })

    it('rejects empty string data with 400', async () => {
      const error = await $fetch('/api/generate', {
        method: 'POST',
        body: { data: '   ' },
      }).catch((e: any) => e)
      expect((error as any)?.statusCode).toBe(400)
    })
  })

  describe('page rendering', () => {
    it('GET / renders index page', async () => {
      const html = await $fetch('/')
      expect(html).toContain('</html>')
    })

    it('GET /generate renders page with svg', async () => {
      const html = await $fetch('/generate')
      expect(html).toContain('<svg')
    })
  })
})
