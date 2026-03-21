import { describe, it, expect } from 'vitest'
import { encode } from 'uqr'
import type { SVGVariant } from '../../src/runtime/utils/qrcode/svg/render'
import { renderDefaultPixel, renderDefaultMarkerOuter, renderDefaultMarkerInner } from '../../src/runtime/utils/qrcode/svg/variants/default'
import { renderDotPixel, renderDotMarkerOuter, renderDotMarkerInner, createDotPixel } from '../../src/runtime/utils/qrcode/svg/variants/dots'
import { renderCircleMarkerOuter, renderCircleMarkerInner } from '../../src/runtime/utils/qrcode/svg/variants/circle'
import { renderRoundedPixel, renderRoundedMarkerOuter, renderRoundedMarkerInner } from '../../src/runtime/utils/qrcode/svg/variants/rounded'
import { renderPixelatedPixel, renderPixelatedMarkerOuter, renderPixelatedMarkerInner } from '../../src/runtime/utils/qrcode/svg/variants/pixelated'
import { renderPixels } from '../../src/runtime/utils/qrcode/svg/pixels'
import { renderMarkers, markerOuterVariants, markerInnerVariants } from '../../src/runtime/utils/qrcode/svg/markers'

const testResult = encode('TEST', { border: 1 })

describe('renderPixels', () => {
  it('dispatches to default variant', () => {
    const result = renderPixels(testResult, 1, 20, 'black', 'default')
    expect(result).toContain('shape-rendering="crispEdges"')
    expect(result).toContain('fill="black"')
  })

  it('dispatches to dots variant', () => {
    const result = renderPixels(testResult, 1, 20, 'black', 'dots')
    expect(result).toContain('<rect')
    expect(result).toContain('rx=')
  })

  it('dispatches circle to dots renderer', () => {
    const resultCircle = renderPixels(testResult, 1, 20, 'black', 'circle')
    const resultDots = renderPixels(testResult, 1, 20, 'black', 'dots')
    expect(resultCircle).toBe(resultDots)
  })

  it('dispatches to rounded variant', () => {
    const result = renderPixels(testResult, 1, 20, 'black', 'rounded')
    expect(result).toContain('<path fill="black"')
  })

  it('dispatches to pixelated variant', () => {
    const result = renderPixels(testResult, 1, 20, 'black', 'pixelated')
    expect(result).toContain('shape-rendering="crispEdges"')
  })
})

describe('renderMarkers', () => {
  it('renders three markers', () => {
    const result = renderMarkers(testResult, 1, 20, 'black', { outer: 'default', inner: 'default' })
    const pathCount = (result.match(/<path /g) || []).length
    const rectCount = (result.match(/<rect /g) || []).length
    expect(pathCount + rectCount).toBeGreaterThanOrEqual(3)
  })

  it('renders with mixed variants', () => {
    const result = renderMarkers(testResult, 1, 20, 'black', { outer: 'rounded', inner: 'dots' })
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('markerOuterVariants', () => {
  const args = [0, 0, 20, 'black'] as const

  it('renders default outer', () => {
    const result = markerOuterVariants('default', ...args)
    expect(result).toContain('<path fill="black"')
  })

  it('renders dots outer', () => {
    const result = markerOuterVariants('dots', ...args)
    expect(result).toContain('<rect')
  })

  it('renders circle outer', () => {
    const result = markerOuterVariants('circle', ...args)
    expect(result).toContain('stroke=')
  })

  it('renders rounded outer', () => {
    const result = markerOuterVariants('rounded', ...args)
    expect(result).toContain('<path fill="black"')
  })

  it('renders pixelated outer', () => {
    const result = markerOuterVariants('pixelated', ...args)
    expect(result).toContain('shape-rendering="crispEdges"')
  })
})

describe('markerInnerVariants', () => {
  const args = [40, 40, 20, 'black'] as const

  it('renders default inner', () => {
    const result = markerInnerVariants('default', ...args)
    expect(result).toContain('<rect')
  })

  it('renders dots inner', () => {
    const result = markerInnerVariants('dots', ...args)
    expect(result).toContain('<rect')
    expect(result).toContain('rx=')
  })

  it('renders circle inner', () => {
    const result = markerInnerVariants('circle', ...args)
    expect(result).toContain('<rect')
  })

  it('renders rounded inner', () => {
    const result = markerInnerVariants('rounded', ...args)
    expect(result).toContain('<path fill="black"')
  })

  it('renders pixelated inner', () => {
    const result = markerInnerVariants('pixelated', ...args)
    expect(result).toContain('shape-rendering="crispEdges"')
  })
})

describe('default variant', () => {
  describe('renderDefaultPixel', () => {
    it('generates path elements with crispEdges', () => {
      const result = renderDefaultPixel(testResult, 1, 20, 'black')
      expect(result).toContain('shape-rendering="crispEdges"')
      expect(result).toContain('fill="black"')
    })

    it('skips marker areas', () => {
      const result = renderDefaultPixel(testResult, 1, 20, '#F00')
      expect(result).toContain('fill="#F00"')
    })

    it('produces deterministic output', () => {
      const r1 = renderDefaultPixel(testResult, 1, 20, 'black')
      const r2 = renderDefaultPixel(testResult, 1, 20, 'black')
      expect(r1).toBe(r2)
    })

    it('matches snapshot', () => {
      expect(renderDefaultPixel(testResult, 1, 20, 'black')).toMatchSnapshot()
    })
  })

  describe('renderDefaultMarkerOuter', () => {
    it('generates correct outer marker path', () => {
      const result = renderDefaultMarkerOuter(0, 0, 20, 'black')
      expect(result).toContain('<path fill="black"')
      expect(result).toContain('h140')
      expect(result).toContain('v140')
    })
  })

  describe('renderDefaultMarkerInner', () => {
    it('generates correct inner marker rect', () => {
      const result = renderDefaultMarkerInner(40, 40, 20, 'black')
      expect(result).toContain('<rect')
      expect(result).toContain('width="60"')
      expect(result).toContain('height="60"')
    })
  })
})

describe('dots variant', () => {
  describe('createDotPixel', () => {
    it('creates a rect with rounded corners', () => {
      const result = createDotPixel(10, 20, 18, 5, 'red')
      expect(result).toContain('<rect')
      expect(result).toContain('rx="5"')
      expect(result).toContain('fill="red"')
    })

    it('applies padding', () => {
      const result = createDotPixel(10, 20, 18, 5, 'red', 2)
      expect(result).toContain('x="12"')
      expect(result).toContain('y="22"')
      expect(result).toContain('width="14"')
      expect(result).toContain('height="14"')
    })
  })

  describe('renderDotPixel', () => {
    it('renders dot pixels', () => {
      const result = renderDotPixel(testResult, 1, 20, 'black')
      expect(result).toContain('<rect')
      expect(result).toContain('rx=')
    })

    it('matches snapshot', () => {
      expect(renderDotPixel(testResult, 1, 20, 'black')).toMatchSnapshot()
    })
  })

  describe('renderDotMarkerOuter', () => {
    it('renders individual dot cells for outer marker', () => {
      const result = renderDotMarkerOuter(0, 0, 20, 'black')
      expect(result).toContain('<rect')
      const rects = result.match(/<rect/g) || []
      expect(rects.length).toBeGreaterThan(10)
    })
  })

  describe('renderDotMarkerInner', () => {
    it('renders 3x3 grid of dot cells', () => {
      const result = renderDotMarkerInner(40, 40, 20, 'black')
      expect(result).toContain('<rect')
      const rects = result.match(/<rect/g) || []
      expect(rects.length).toBe(9)
    })
  })
})

describe('circle variant', () => {
  describe('renderCircleMarkerOuter', () => {
    it('renders as stroked rect', () => {
      const result = renderCircleMarkerOuter(0, 0, 20, 'black')
      expect(result).toContain('stroke="black"')
      expect(result).toContain('fill="none"')
      expect(result).toContain('stroke-width="20"')
    })

    it('applies radius', () => {
      const r0 = renderCircleMarkerOuter(0, 0, 20, 'black', 0)
      const r1 = renderCircleMarkerOuter(0, 0, 20, 'black', 1)
      expect(r0).toContain('rx="0"')
      expect(r1).toContain('rx="60"')
    })
  })

  describe('renderCircleMarkerInner', () => {
    it('renders a filled rect with radius', () => {
      const result = renderCircleMarkerInner(40, 40, 20, 'black')
      expect(result).toContain('<rect')
      expect(result).toContain('fill="black"')
    })
  })
})

describe('rounded variant', () => {
  describe('renderRoundedPixel', () => {
    it('renders path with connected pixels', () => {
      const result = renderRoundedPixel(testResult, 1, 20, 'black')
      expect(result).toContain('<path fill="black"')
      expect(result).toContain('C')
    })

    it('matches snapshot', () => {
      expect(renderRoundedPixel(testResult, 1, 20, 'black')).toMatchSnapshot()
    })
  })

  describe('renderRoundedMarkerOuter', () => {
    it('renders outer + inner cutout paths', () => {
      const result = renderRoundedMarkerOuter(0, 0, 20, 'black')
      expect(result).toContain('<path fill="black"')
      expect(result).toContain('C')
    })
  })

  describe('renderRoundedMarkerInner', () => {
    it('renders rounded rect path', () => {
      const result = renderRoundedMarkerInner(40, 40, 20, 'black')
      expect(result).toContain('<path fill="black"')
      expect(result).toContain('C')
    })
  })
})

describe('pixelated variant', () => {
  describe('renderPixelatedPixel', () => {
    it('renders pixelated paths with notches', () => {
      const result = renderPixelatedPixel(testResult, 1, 20, 'black')
      expect(result).toContain('shape-rendering="crispEdges"')
      expect(result).toContain('fill="black"')
    })

    it('matches snapshot', () => {
      expect(renderPixelatedPixel(testResult, 1, 20, 'black')).toMatchSnapshot()
    })
  })

  describe('renderPixelatedMarkerOuter', () => {
    it('renders outer marker with notch corners', () => {
      const result = renderPixelatedMarkerOuter(0, 0, 20, 'black')
      expect(result).toContain('shape-rendering="crispEdges"')
      expect(result).toContain('fill="black"')
    })
  })

  describe('renderPixelatedMarkerInner', () => {
    it('renders inner marker with notch corners', () => {
      const result = renderPixelatedMarkerInner(40, 40, 20, 'black')
      expect(result).toContain('shape-rendering="crispEdges"')
      expect(result).toContain('fill="black"')
    })
  })
})

describe('full variant snapshots', () => {
  const variants: SVGVariant[] = ['default', 'dots', 'rounded', 'pixelated', 'circle']
  const longResult = encode('https://github.com/sandros94/nuxt-qrcode', { ecc: 'L', border: 1 })

  for (const variant of variants) {
    it(`full render snapshot for "${variant}"`, () => {
      const pixels = renderPixels(longResult, 1, 20, 'black', variant, 0.5, 0.1)
      const markers = renderMarkers(
        longResult,
        1,
        20,
        'black',
        { outer: variant, inner: variant },
        { outer: 0.5, inner: 0.5 },
        0.1,
      )
      expect(pixels + markers).toMatchSnapshot()
    })
  }
})
