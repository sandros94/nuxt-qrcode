export default defineEventHandler(async (event) => {
  const { data } = await readBody<{ data?: string }>(event)

  if (!data) throw createError({
    statusCode: 400,
    message: 'Missing data to encode',
  })

  return useQrcode(data)
})
