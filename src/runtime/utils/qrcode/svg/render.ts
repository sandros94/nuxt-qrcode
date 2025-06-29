import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import { base64Encode } from '../../'
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
  DEFAULT_PIXEL_SIZE,
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
    pixelSize,
    pixelPadding,
    variant,
    ...opts
  } = options

  const result = encode(data, opts)
  const { width, height } = getSize(result.size, pixelSize)

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`

  svg += renderSVGBody(result, options)

  svg += '</svg>'
  return svg
}

export function renderSVGBase64(
  data: QrCodeGenerateData,
  options: RenderSVGOptions = {},
) {
  return `data:image/svg+xml;base64,${base64Encode(renderSVG(data, options))}`
}

export function renderSVGBody(
  result: ReturnType<typeof encode>,
  options: RenderSVGOptions = {},
): string {
  const {
    radius,
    pixelSize = DEFAULT_PIXEL_SIZE,
    pixelPadding,
    variant,
    border,
  } = options

  const { backgroundColor, foregroundColor } = getColors(options)
  const { width, height } = getSize(result.size, pixelSize)
  let svgBody = `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`

  const { pixelRadius, markerRadius } = getRadius(radius)
  const { pixelVariant, markerVariant } = getVariant(variant)

  svgBody += renderPixels(result, border, pixelSize, foregroundColor, pixelVariant, pixelRadius, pixelPadding)
  svgBody += renderMarkers(result, border, pixelSize, foregroundColor, markerVariant, markerRadius, pixelPadding)

  return svgBody
}
