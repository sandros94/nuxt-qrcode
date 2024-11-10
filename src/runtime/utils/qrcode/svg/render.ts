import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import {
  renderMarkersDefault,
  renderPixelsDefault,
} from './variants/default'
import {
  renderMarkersCircular,
  renderPixelsCircular,
} from './variants/circular'
import {
  renderMarkersRounded,
  renderPixelsRounded,
} from './variants/rounded'
import {
  renderMarkersPixelated,
  renderPixelsPixelated,
} from './variants/pixelated'

export type SVGVariant = 'default' | 'circular' | 'rounded' | 'pixelated'

export interface RenderSVGOptions extends QrCodeGenerateSvgOptions {
  variant?: SVGVariant | {
    pixel?: SVGVariant
    marker?: SVGVariant
  }
  radius?: number | {
    marker?: number
    pixel?: number
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
  const pixelVariant = typeof variant === 'string' ? variant : variant?.pixel || 'default'
  const markerVariant = typeof variant === 'string' ? variant : variant?.marker || 'default'

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`
  svg += `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`

  svg += pixelVariants(pixelVariant, result, opts.border, pixelSize, foregroundColor, pixelRadius, pixelPadding)
  svg += markerVariants(markerVariant, result, opts.border, pixelSize, foregroundColor, markerRadius, pixelPadding)

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
    case 'circular':
      return renderPixelsCircular(result, border, size, color, radius, padding)
    case 'rounded':
      return renderPixelsRounded(result, border, size, color, radius)
    case 'pixelated':
      return renderPixelsPixelated(result, border, size, color)
    case 'default':
    default:
      return renderPixelsDefault(result, border, size, color)
  }
}

export function markerVariants(
  variant: SVGVariant = 'default',
  result: ReturnType<typeof encode>,
  border: number = 1,
  size: number,
  color: string,
  radius: number,
  padding: number,
): string {
  switch (variant) {
    case 'circular':
      return renderMarkersCircular(result, border, size, color, radius, padding)
    case 'rounded':
      return renderMarkersRounded(result, border, size, color, radius)
    case 'pixelated':
      return renderMarkersPixelated(result, border, size, color)
    case 'default':
    default:
      return renderMarkersDefault(result, border, size, color)
  }
}

export function getColors(options: QrCodeGenerateSvgOptions): { backgroundColor: string, foregroundColor: string } {
  const { whiteColor = 'white', blackColor = 'black', invert = false } = options
  return {
    backgroundColor: invert ? blackColor : whiteColor,
    foregroundColor: invert ? whiteColor : blackColor,
  }
}

export function limitInput(number: number): number {
  return Math.max(0, Math.min(1, number))
}

export function renderUtils(qrSize: number, qrBorder: number, markerSize: number = 7) {
  const innerSize = qrSize - qrBorder

  const d = (n: number) => n - qrBorder

  const isTopLeft = (row: number, col: number) => d(row) < markerSize && d(col) < markerSize
  const isTopRight = (row: number, col: number) => d(row) < markerSize && d(col) >= innerSize - markerSize - 1
  const isBottomLeft = (row: number, col: number) => d(row) >= innerSize - markerSize - 1 && d(col) < markerSize

  const isMarker = (row: number, col: number) => isTopLeft(row, col) || isTopRight(row, col) || isBottomLeft(row, col)
  const isMarkerCenter = (row: number, col: number) => {
    let center = false
    if (isMarker(row, col)) {
      const localX = isTopRight(row, col) ? d(row) - (innerSize - markerSize) : d(row)
      const localY = isBottomLeft(row, col) ? d(col) - (innerSize - markerSize) : d(col)
      center = localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4
    }
    return center
  }

  return {
    isTopLeft,
    isTopRight,
    isBottomLeft,
    isMarker,
    isMarkerCenter,
    markerPositions: [
      [qrBorder, qrBorder],
      [qrBorder, innerSize - markerSize],
      [innerSize - markerSize, qrBorder],
    ],
  }
}
