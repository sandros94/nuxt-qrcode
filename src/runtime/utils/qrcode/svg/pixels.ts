import type { encode } from 'uqr'
import type {
  SVGVariant,
} from './render'
import {
  renderDefaultPixel,
  renderDotPixel,
  renderRoundedPixel,
  renderPixelatedPixel,
} from './variants'

export function renderPixels(
  result: ReturnType<typeof encode>,
  border: number = 1,
  size: number,
  color: string,
  variant: SVGVariant = 'default',
  radius?: number,
  padding?: number,
): string {
  switch (variant) {
    case 'circle':
    case 'dots':
      return renderDotPixel(result, border, size, color, radius, padding)
    case 'rounded':
      return renderRoundedPixel(result, border, size, color, radius)
    case 'pixelated':
      return renderPixelatedPixel(result, border, size, color)
    case 'default':
    default:
      return renderDefaultPixel(result, border, size, color)
  }
}
