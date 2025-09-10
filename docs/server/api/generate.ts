import * as v from 'valibot'

const objAsString = <const Schema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(schema: Schema) => v.message(
  v.pipe(
    v.string(),
    v.parseJson(),
    schema,
  ),
  e => `Must be a valid JSON object or array string, received: ${e.received}`,
)

const schemaStyles = v.message(
  v.picklist(['default', 'dots', 'rounded', 'pixelated', 'circle']),
  e => `Invalid style, available styles are: default, dots, rounded, pixelated, circle. Received: ${e.received}`,
)
const schemaNumber = v.message(
  v.union([
    v.pipe(
      v.string(),
      v.decimal(),
      v.transform(Number),
    ),
    v.number(),
  ]),
  e => `Value must be a number, received: ${e.received}`,
)
const schemaClampValue = v.message(
  v.pipe(
    schemaNumber,
    v.minValue(0),
    v.maxValue(1),
  ),
  e => `Value must be a number between 0 and 1 (inclusive), received: ${e.received}`,
)
const schemaBoolean = v.message(v.union([
  v.pipe(
    v.string(),
    v.regex(/^(true|false)$/),
    v.transform(value => value === 'true'),
  ),
  v.boolean(),
]), e => `Invalid boolean value, received: ${e.received}`)

const schemaOptions = v.partial(v.object({
  pixelPadding: schemaClampValue,
  pixelSize: v.pipe(schemaNumber, v.minValue(1, 'Pixel size must be greater than 0')),
  variant: v.union([
    schemaStyles,
    objAsString(v.partial(v.object({
      pixel: schemaStyles,
      marker: schemaStyles,
      inner: schemaStyles,
    }))),
  ]),
  radius: v.union([
    schemaClampValue,
    objAsString(v.partial(v.object({
      pixel: schemaClampValue,
      marker: schemaClampValue,
      inner: schemaClampValue,
    }))),
  ]),
  toBase64: schemaBoolean,
  whiteColor: v.pipe(v.string(), v.nonEmpty()),
  blackColor: v.pipe(v.string(), v.nonEmpty()),
  border: v.pipe(schemaNumber, v.minValue(0, 'Border must be greater than or equal to 0')),
  invert: schemaBoolean,
  ecc: v.message(
    v.pipe(
      v.string(),
      v.trim(),
      v.regex(/^([LMQH])$/i),
      v.toUpperCase(),
    ) as v.BaseSchema<string, 'L' | 'M' | 'Q' | 'H', v.BaseIssue<unknown>>,
    e => `Invalid ECC level, available levels are: L, M, Q, H. Received: ${e.received}`,
  ),
  boostEcc: schemaBoolean,
}))
const inputParser = v.parser(v.object({
  ...schemaOptions.entries,
  value: v.message(v.pipe(v.string(), v.trim(), v.nonEmpty()), 'A string value is required to generate a QR code'),
}))

export default defineEventHandler(async (event) => {
  let value: string
  let options: v.InferOutput<typeof schemaOptions>

  if (event.method === 'GET') {
    const { value: val, ...opts } = await getValidatedQuery(event, inputParser)
    value = val
    options = opts
  }
  else if (event.method === 'POST') {
    const { value: val, ...opts } = await readValidatedBody(event, inputParser)
    value = val
    options = opts
  }
  else {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  if (options.toBase64) {
    setHeader(event, 'Content-Type', 'image/svg+xml;base64')
  }
  else {
    setHeader(event, 'Content-Type', 'image/svg+xml')
  }
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return useQrcode(value, options)
})
