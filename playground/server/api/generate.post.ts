export default defineEventHandler(async (event) => {
  const { data } = await readBody<{ data?: string }>(event)

  if (!data || typeof data !== 'string' || !data.trim()) throw createError({
    statusCode: 400,
    message: !data ? 'Missing data to encode' : 'Data must be a string',
  })

  // setHeader(event, 'Content-Type', 'image/svg+xml') // TODO: this creates a `Cannot stringify arbitrary non-POJOs` error
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return useQrcode(data.trim(), {
    variant: 'pixelated',
    toBase64: true,
  })
})
