import { describe, it, expect } from 'vitest'
import { useQrcode } from '../../src/runtime/composables/use-qrcode'

describe('useQrcode', () => {
  const testData = 'https://github.com/sandros94/nuxt-qrcode'

  it('should generate QR code with default options', () => {
    const result = useQrcode(testData)
    expect(result.value).toMatchSnapshot()
  })

  it('should generate QR code with custom variant', () => {
    const result = useQrcode(testData, { variant: 'circular' })
    expect(result.value).toMatchSnapshot()
  })

  it('should generate QR code with custom radius', () => {
    const result = useQrcode(testData, { radius: 0.5 })
    expect(result.value).toMatchSnapshot()
  })

  it('should generate QR code with custom variant and radius', () => {
    const result = useQrcode(testData, { variant: 'rounded', radius: { pixel: 0.3, marker: 0.7 } })
    expect(result.value).toMatchSnapshot()
  })

  it('should generate QR code with different pixel and marker variants', () => {
    const result = useQrcode(testData, { variant: { pixel: 'circular', marker: 'rounded' } })
    expect(result.value).toMatchSnapshot()
  })
})