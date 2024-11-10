// src/runtime/utils/qrcode/svg/markers.ts

import type { encode } from 'uqr'
import {
  type SVGVariant,
  renderUtils,
} from './render'
import {
  renderDotMarkerOuter,
  renderDotMarkerInner,
  renderDefaultMarkerOuter,
  renderDefaultMarkerInner,
  renderPixelatedMarkerOuter,
  renderPixelatedMarkerInner,
  renderRoundedMarkerOuter,
  renderRoundedMarkerInner,
} from './variants'

type MarkerVariant = SVGVariant

export function renderMarkers(
  result: ReturnType<typeof encode>,
  border: number = 1,
  size: number,
  color: string,
  padding: number,
  outerVariant: MarkerVariant = 'default',
  innerVariant: MarkerVariant = 'default',
  outerRadius: number,
  innerRadius: number,
) {
  const { markerPositions } = renderUtils(result.size, border)

  let svg = ''

  markerPositions.forEach(([row, col]) => {
    const ox = col * size
    const oy = row * size
    const ix = ox + 2 * size
    const iy = oy + 2 * size

    svg += markerOuterVariants(outerVariant, ox, oy, size, color, outerRadius, padding)
    svg += markerInnerVariants(innerVariant, ix, iy, size, color, innerRadius, padding)
  })

  return svg
}

export function markerOuterVariants(
  variant: SVGVariant = 'default',
  x: number,
  y: number,
  size: number,
  color: string,
  radius: number,
  padding: number,
): string {
  switch (variant) {
    case 'dots':
      return renderDotMarkerOuter(x, y, size, color, radius, padding)
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
  radius: number,
  padding: number,
): string {
  switch (variant) {
    case 'dots':
      return renderDotMarkerInner(x, y, size, color, radius, padding)
    case 'rounded':
      return renderRoundedMarkerInner(x, y, size, color, radius)
    case 'pixelated':
      return renderPixelatedMarkerInner(x, y, size, color)
    case 'default':
    default:
      return renderDefaultMarkerInner(x, y, size, color)
  }
}
