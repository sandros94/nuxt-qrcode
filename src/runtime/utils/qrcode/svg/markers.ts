import type { encode } from 'uqr'
import type {
  SVGVariant,
} from './render'
import {
  renderUtils,
} from './utils'
import {
  renderCircleMarkerOuter,
  renderCircleMarkerInner,
  renderDefaultMarkerOuter,
  renderDefaultMarkerInner,
  renderDotMarkerOuter,
  renderDotMarkerInner,
  renderPixelatedMarkerOuter,
  renderPixelatedMarkerInner,
  renderRoundedMarkerOuter,
  renderRoundedMarkerInner,
} from './variants'

export function renderMarkers(
  result: ReturnType<typeof encode>,
  border: number = 1,
  size: number,
  color: string,
  variant: {
    outer: SVGVariant
    inner: SVGVariant
  },
  radius?: {
    outer: number
    inner: number
  },
  padding?: number,
) {
  const { markerPositions } = renderUtils(result.size, border)

  let svg = ''

  markerPositions.forEach(([row, col]) => {
    const ox = col! * size
    const oy = row! * size
    const ix = ox + 2 * size
    const iy = oy + 2 * size

    svg += markerOuterVariants(variant.outer, ox, oy, size, color, radius?.outer, padding)
    svg += markerInnerVariants(variant.inner, ix, iy, size, color, radius?.inner, padding)
  })

  return svg
}

export function markerOuterVariants(
  variant: SVGVariant = 'default',
  x: number,
  y: number,
  size: number,
  color: string,
  radius?: number,
  padding?: number,
): string {
  switch (variant) {
    case 'dots':
      return renderDotMarkerOuter(x, y, size, color, radius, padding)
    case 'circle':
      return renderCircleMarkerOuter(x, y, size, color, radius)
    case 'rounded':
      return renderRoundedMarkerOuter(x, y, size, color, radius)
    case 'pixelated':
      return renderPixelatedMarkerOuter(x, y, size, color)
    case 'default':
    default:
      return renderDefaultMarkerOuter(x, y, size, color)
  }
}

export function markerInnerVariants(
  variant: SVGVariant = 'default',
  x: number,
  y: number,
  size: number,
  color: string,
  radius?: number,
  padding?: number,
): string {
  switch (variant) {
    case 'dots':
      return renderDotMarkerInner(x, y, size, color, radius, padding)
    case 'circle':
      return renderCircleMarkerInner(x, y, size, color, radius)
    case 'rounded':
      return renderRoundedMarkerInner(x, y, size, color, radius)
    case 'pixelated':
      return renderPixelatedMarkerInner(x, y, size, color)
    case 'default':
    default:
      return renderDefaultMarkerInner(x, y, size, color)
  }
}
