import { describe, it, expect } from 'vitest'
import { useQrcode } from '../../src/runtime/composables/use-qrcode'

describe('useQrcode', () => {
  const testData = 'https://github.com/sandros94/nuxt-qrcode'

  it('default options', () => {
    const result = useQrcode(testData)
    expect(result.value).toMatchSnapshot()
  })

  it('custom color', () => {
    const result = useQrcode(testData, { whiteColor: 'transparent', blackColor: '#F0F' })
    expect(result.value).toMatchSnapshot()
  })

  it('custom variant', () => {
    const result = useQrcode(testData, { variant: 'pixelated' })
    expect(result.value).toMatchSnapshot()
  })

  it('custom radius', () => {
    const result = useQrcode(testData, { radius: 0.5 })
    expect(result.value).toMatchSnapshot()
  })

  it('custom variant and radius', () => {
    const result = useQrcode(testData, { variant: 'rounded', radius: { pixel: 0.3, marker: 0.7 } })
    expect(result.value).toMatchSnapshot()
  })

  it('different pixel and marker variants', () => {
    const result = useQrcode(testData, { variant: { pixel: 'dots', marker: 'rounded', inner: 'circle' } })
    expect(result.value).toMatchSnapshot()
  })

  it('different borders', () => {
    const result = useQrcode(testData, { border: 9 })
    expect(result.value).toMatchSnapshot()
  })
})
