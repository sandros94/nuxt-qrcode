import { describe, it, expect } from 'vitest'
import {
  getColors,
  getSize,
  getRadius,
  getVariant,
  limitInput,
  renderUtils,
  DEFAULT_RADIUS,
  DEFAULT_PADDING,
  DEFAULT_PIXEL_SIZE,
} from '../../src/runtime/utils/qrcode/svg/utils'
import { base64Encode } from '../../src/runtime/utils'

describe('base64Encode', () => {
  it('encodes a simple string', () => {
    const result = base64Encode('hello')
    expect(result).toBe(btoa('hello'))
  })

  it('encodes an empty string', () => {
    const result = base64Encode('')
    expect(result).toBe(btoa(''))
  })

  it('encodes a Uint8Array', () => {
    const data = new TextEncoder().encode('hello')
    const result = base64Encode(data)
    expect(result).toBe(btoa('hello'))
  })

  it('encodes unicode characters', () => {
    const result = base64Encode('https://example.com?q=test&lang=en')
    expect(result).toBe(btoa('https://example.com?q=test&lang=en'))
  })
})

describe('getColors', () => {
  it('returns default colors', () => {
    expect(getColors({})).toEqual({
      backgroundColor: 'white',
      foregroundColor: 'black',
    })
  })

  it('returns custom colors', () => {
    expect(getColors({ whiteColor: '#FFF', blackColor: '#000' })).toEqual({
      backgroundColor: '#FFF',
      foregroundColor: '#000',
    })
  })

  it('inverts colors when invert is true', () => {
    expect(getColors({ invert: true })).toEqual({
      backgroundColor: 'black',
      foregroundColor: 'white',
    })
  })

  it('inverts custom colors', () => {
    expect(getColors({ whiteColor: 'transparent', blackColor: '#F0F', invert: true })).toEqual({
      backgroundColor: '#F0F',
      foregroundColor: 'transparent',
    })
  })
})

describe('getSize', () => {
  it('returns size with default pixel size', () => {
    const result = getSize(31)
    expect(result).toEqual({
      width: 31 * DEFAULT_PIXEL_SIZE,
      height: 31 * DEFAULT_PIXEL_SIZE,
    })
  })

  it('returns size with custom pixel size', () => {
    const result = getSize(25, 10)
    expect(result).toEqual({ width: 250, height: 250 })
  })

  it('handles size of 1', () => {
    const result = getSize(1, 5)
    expect(result).toEqual({ width: 5, height: 5 })
  })
})

describe('getRadius', () => {
  it('returns default radius when undefined', () => {
    const result = getRadius(undefined)
    expect(result).toEqual({
      pixelRadius: DEFAULT_RADIUS,
      markerRadius: {
        outer: DEFAULT_RADIUS,
        inner: DEFAULT_RADIUS,
      },
    })
  })

  it('applies a single number to all radii', () => {
    const result = getRadius(0.8)
    expect(result).toEqual({
      pixelRadius: 0.8,
      markerRadius: {
        outer: 0.8,
        inner: 0.8,
      },
    })
  })

  it('applies object with per-part radii', () => {
    const result = getRadius({ pixel: 0.1, marker: 0.7, inner: 0.3 })
    expect(result).toEqual({
      pixelRadius: 0.1,
      markerRadius: {
        outer: 0.7,
        inner: 0.3,
      },
    })
  })

  it('uses marker radius as inner default', () => {
    const result = getRadius({ pixel: 0.2, marker: 0.9 })
    expect(result).toEqual({
      pixelRadius: 0.2,
      markerRadius: {
        outer: 0.9,
        inner: 0.9,
      },
    })
  })

  it('uses custom default radius', () => {
    const result = getRadius(undefined, 0.3)
    expect(result.pixelRadius).toBe(0.3)
    expect(result.markerRadius.outer).toBe(0.3)
  })
})

describe('getVariant', () => {
  it('returns default variant when undefined', () => {
    const result = getVariant(undefined)
    expect(result).toEqual({
      pixelVariant: 'default',
      markerVariant: {
        outer: 'default',
        inner: 'default',
      },
    })
  })

  it('applies a single string to all variants', () => {
    const result = getVariant('dots')
    expect(result).toEqual({
      pixelVariant: 'dots',
      markerVariant: {
        outer: 'dots',
        inner: 'dots',
      },
    })
  })

  it('applies object with per-part variants', () => {
    const result = getVariant({ pixel: 'dots', marker: 'rounded', inner: 'circle' })
    expect(result).toEqual({
      pixelVariant: 'dots',
      markerVariant: {
        outer: 'rounded',
        inner: 'circle',
      },
    })
  })

  it('uses marker variant as inner default', () => {
    const result = getVariant({ pixel: 'dots', marker: 'rounded' })
    expect(result).toEqual({
      pixelVariant: 'dots',
      markerVariant: {
        outer: 'rounded',
        inner: 'rounded',
      },
    })
  })

  it('uses custom default variant', () => {
    const result = getVariant(undefined, 'circle')
    expect(result.pixelVariant).toBe('circle')
    expect(result.markerVariant.outer).toBe('circle')
  })
})

describe('limitInput', () => {
  it('returns the value when between 0 and 1', () => {
    expect(limitInput(0.5)).toBe(0.5)
  })

  it('clamps to 0 for negative values', () => {
    expect(limitInput(-1)).toBe(0)
    expect(limitInput(-0.5)).toBe(0)
  })

  it('clamps to 1 for values above 1', () => {
    expect(limitInput(2)).toBe(1)
    expect(limitInput(1.5)).toBe(1)
  })

  it('returns exact bounds', () => {
    expect(limitInput(0)).toBe(0)
    expect(limitInput(1)).toBe(1)
  })
})

describe('renderUtils', () => {
  it('identifies marker positions for standard qr size', () => {
    const utils = renderUtils(25, 1)
    expect(utils.markerPositions).toHaveLength(3)

    expect(utils.isMarker(1, 1)).toBe(true)
    expect(utils.isMarker(1, 17)).toBe(true)
    expect(utils.isMarker(17, 1)).toBe(true)
  })

  it('detects top-left marker area', () => {
    const utils = renderUtils(25, 1)
    expect(utils.isTopLeft(0, 0)).toBe(true)
    expect(utils.isTopLeft(6, 6)).toBe(true)
    expect(utils.isTopLeft(7, 0)).toBe(false)
  })

  it('detects top-right marker area', () => {
    const utils = renderUtils(25, 1)
    expect(utils.isTopRight(0, 17)).toBe(true)
    expect(utils.isTopRight(0, 16)).toBe(false)
  })

  it('detects bottom-left marker area', () => {
    const utils = renderUtils(25, 1)
    expect(utils.isBottomLeft(17, 0)).toBe(true)
    expect(utils.isBottomLeft(16, 0)).toBe(false)
  })

  it('does not mark non-marker area as marker', () => {
    const utils = renderUtils(25, 1)
    expect(utils.isMarker(10, 10)).toBe(false)
  })

  it('detects marker center positions', () => {
    const utils = renderUtils(25, 1)
    expect(utils.isMarkerCenter(3, 3)).toBe(true)
    expect(utils.isMarkerCenter(4, 4)).toBe(true)
    expect(utils.isMarkerCenter(5, 5)).toBe(true)
    expect(utils.isMarkerCenter(1, 1)).toBe(false)
  })

  it('provides marker center positions', () => {
    const utils = renderUtils(25, 1)
    expect(utils.markerCenterPositions).toHaveLength(3)
    expect(utils.markerCenterPositions[0]).toEqual([3, 3])
  })

  it('handles different border values', () => {
    const utils = renderUtils(31, 2)
    expect(utils.markerPositions[0]).toEqual([2, 2])
    expect(utils.isMarker(2, 2)).toBe(true)
    expect(utils.isMarker(1, 1)).toBe(false)
  })
})

describe('constants', () => {
  it('exports expected defaults', () => {
    expect(DEFAULT_RADIUS).toBe(0.5)
    expect(DEFAULT_PADDING).toBe(0.1)
    expect(DEFAULT_PIXEL_SIZE).toBe(20)
  })
})
