import { describe, it, expect } from 'vitest'
import { renderSVG, renderSVGBase64, renderSVGBody } from '../../src/runtime/utils/qrcode/svg/render'
import type { SVGVariant } from '../../src/runtime/utils/qrcode/svg/render'
import { encode } from 'uqr'

const testData = 'https://github.com/sandros94/nuxt-qrcode'
const shortData = 'TEST'

describe('renderSVG', () => {
  it('generates valid svg string', () => {
    const svg = renderSVG(testData)
    expect(svg).toMatch(/^<svg/)
    expect(svg).toMatch(/<\/svg>$/)
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('viewBox="0 0')
  })

  it('contains background rect', () => {
    const svg = renderSVG(testData)
    expect(svg).toContain('<rect fill="white"')
  })

  it('contains pixel paths', () => {
    const svg = renderSVG(testData)
    expect(svg).toContain('<path fill="black"')
  })

  it('generates deterministic output', () => {
    const svg1 = renderSVG(testData)
    const svg2 = renderSVG(testData)
    expect(svg1).toBe(svg2)
  })

  it('produces different output for different data', () => {
    const svg1 = renderSVG('hello')
    const svg2 = renderSVG('world')
    expect(svg1).not.toBe(svg2)
  })

  it('applies custom pixel size', () => {
    const svg = renderSVG(shortData, { pixelSize: 10 })
    expect(svg).toContain('viewBox="0 0')
    const defaultSvg = renderSVG(shortData)
    expect(svg).not.toBe(defaultSvg)
  })

  it('applies custom colors', () => {
    const svg = renderSVG(testData, { whiteColor: 'transparent', blackColor: '#F0F' })
    expect(svg).toContain('fill="transparent"')
    expect(svg).toContain('fill="#F0F"')
    expect(svg).not.toContain('fill="white"')
    expect(svg).not.toContain('fill="black"')
  })

  it('applies invert option', () => {
    const svg = renderSVG(testData, { invert: true })
    expect(svg).toContain('<rect fill="black"')
    expect(svg).toContain('fill="white"')
  })

  it('applies custom border', () => {
    const svgDefault = renderSVG(shortData)
    const svgBorder = renderSVG(shortData, { border: 5 })
    expect(svgDefault).not.toBe(svgBorder)
  })

  describe('variants', () => {
    const variants: SVGVariant[] = ['default', 'dots', 'rounded', 'pixelated', 'circle']

    for (const variant of variants) {
      it(`renders with variant "${variant}"`, () => {
        const svg = renderSVG(testData, { variant })
        expect(svg).toMatch(/^<svg/)
        expect(svg).toMatch(/<\/svg>$/)
        expect(svg).toMatchSnapshot()
      })
    }

    it('renders with different pixel and marker variants', () => {
      const svg = renderSVG(testData, {
        variant: { pixel: 'dots', marker: 'rounded', inner: 'circle' },
      })
      expect(svg).toMatch(/^<svg/)
      expect(svg).toMatchSnapshot()
    })
  })

  describe('radius options', () => {
    it('applies single number radius', () => {
      const svg = renderSVG(testData, { radius: 0.8 })
      expect(svg).toMatch(/^<svg/)
      expect(svg).toMatchSnapshot()
    })

    it('applies per-part radius', () => {
      const svg = renderSVG(testData, {
        radius: { pixel: 0.2, marker: 0.8, inner: 0.5 },
      })
      expect(svg).toMatch(/^<svg/)
      expect(svg).toMatchSnapshot()
    })

    it('applies radius with variant', () => {
      const svg = renderSVG(testData, {
        variant: 'rounded',
        radius: { pixel: 0.3, marker: 0.7 },
      })
      expect(svg).toMatchSnapshot()
    })
  })

  describe('ecc options', () => {
    it('respects ecc level L', () => {
      const svg = renderSVG(testData, { ecc: 'L' })
      expect(svg).toMatch(/^<svg/)
    })

    it('respects ecc level H', () => {
      const svg = renderSVG(testData, { ecc: 'H' })
      expect(svg).toMatch(/^<svg/)
    })

    it('produces different output for different ecc levels', () => {
      const svgL = renderSVG(testData, { ecc: 'L' })
      const svgH = renderSVG(testData, { ecc: 'H' })
      expect(svgL).not.toBe(svgH)
    })
  })

  it('handles numeric array data', () => {
    const svg = renderSVG([72, 101, 108, 108, 111])
    expect(svg).toMatch(/^<svg/)
    expect(svg).toMatch(/<\/svg>$/)
  })
})

describe('renderSVGBase64', () => {
  it('returns a data URI', () => {
    const result = renderSVGBase64(testData)
    expect(result).toMatch(/^data:image\/svg\+xml;base64,/)
  })

  it('contains valid base64 after prefix', () => {
    const result = renderSVGBase64(testData)
    const base64 = result.replace('data:image/svg+xml;base64,', '')
    expect(base64.length).toBeGreaterThan(0)
    expect(() => atob(base64)).not.toThrow()
  })

  it('decodes back to valid svg', () => {
    const result = renderSVGBase64(testData)
    const base64 = result.replace('data:image/svg+xml;base64,', '')
    const decoded = atob(base64)
    expect(decoded).toContain('<svg')
    expect(decoded).toContain('</svg>')
  })

  it('passes options through to renderSVG', () => {
    const result = renderSVGBase64(testData, { variant: 'dots' })
    const base64 = result.replace('data:image/svg+xml;base64,', '')
    const decoded = atob(base64)
    expect(decoded).toContain('rx=')
  })
})

describe('renderSVGBody', () => {
  it('returns svg body without wrapping svg tag', () => {
    const result = encode(shortData, {})
    const body = renderSVGBody(result)
    expect(body).not.toContain('<svg')
    expect(body).not.toContain('</svg>')
    expect(body).toContain('<rect fill="white"')
    expect(body).toContain('fill="black"')
  })

  it('uses correct dimensions from encode result', () => {
    const result = encode(shortData, {})
    const body = renderSVGBody(result, { pixelSize: 10 })
    const expectedSize = result.size * 10
    expect(body).toContain(`width="${expectedSize}"`)
    expect(body).toContain(`height="${expectedSize}"`)
  })

  it('applies variant and radius', () => {
    const result = encode(testData, {})
    const bodyDefault = renderSVGBody(result)
    const bodyDots = renderSVGBody(result, { variant: 'dots', radius: 0.8 })
    expect(bodyDefault).not.toBe(bodyDots)
  })
})
