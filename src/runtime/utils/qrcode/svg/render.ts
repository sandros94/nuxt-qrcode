import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import {
  renderDefaultPixel,
  renderDotPixel,
  renderRoundedPixel,
  renderPixelatedPixel,
} from './variants'
import {
  renderMarkers,
} from './markers'
import {
  getColors
} from './utils'

export type SVGVariant = 'default' | 'dots' | 'rounded' | 'pixelated' | 'circle'

export interface RenderSVGOptions extends QrCodeGenerateSvgOptions {
  variant?: SVGVariant | {
    pixel?: SVGVariant
    marker?: SVGVariant
    inner?: SVGVariant
  }
  radius?: number | {
    pixel?: number
    marker?: number
    inner?: number
  }
  pixelPadding?: number
}

export function renderSVG(
  data: QrCodeGenerateData,
  options: RenderSVGOptions = {},
): string {
  const {
    radius,
    pixelSize = 10,
    pixelPadding = 0.1,
    invert,
    variant,
    ...opts
  } = options

  const result = encode(data, opts)
  const { backgroundColor, foregroundColor } = getColors(options)
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  const pixelRadius = typeof radius === 'number' ? radius : radius?.pixel ?? 0.5
  const markerRadius = typeof radius === 'number' ? radius : radius?.marker ?? 0.5
  const innerRadius = typeof radius === 'number' ? radius : radius?.inner ?? markerRadius
  const pixelVariant = typeof variant === 'string' ? variant : variant?.pixel || 'default'
  const markerVariant = typeof variant === 'string' ? variant : variant?.marker || 'default'
  const innerVariant = typeof variant === 'string' ? variant : variant?.inner || markerVariant

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">`
  svg += `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`

  svg += pixelVariants(pixelVariant, result, opts.border, pixelSize, foregroundColor, pixelRadius, pixelPadding)
  svg += renderMarkers(result, opts.border, pixelSize, foregroundColor, pixelPadding, markerVariant, innerVariant, markerRadius, innerRadius)

  svg += '</svg>'
  return svg
}

export function pixelVariants(
  variant: SVGVariant = 'default',
  result: ReturnType<typeof encode>,
  border: number = 1,
  size: number,
  color: string,
  radius: number,
  padding: number,
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
