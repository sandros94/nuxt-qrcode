import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import {
  renderMarkers,
} from './markers'
import {
  renderPixels,
} from './pixels'
import {
  getColors,
  getSize,
  getRadius,
  getVariant,
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
  const { width, height } = getSize(result.size, pixelSize)

  const { pixelRadius, markerRadius } = getRadius(radius)
  const { pixelVariant, markerVariant } = getVariant(variant)

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">`
  svg += `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`

  svg += renderPixels(result, opts.border, pixelSize, foregroundColor, pixelPadding, pixelVariant, pixelRadius)
  svg += renderMarkers(result, opts.border, pixelSize, foregroundColor, pixelPadding, markerVariant, markerRadius)

  svg += '</svg>'
  return svg
}
