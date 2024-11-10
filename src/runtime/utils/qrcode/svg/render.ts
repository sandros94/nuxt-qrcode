import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import {
  renderDefaultMarker,
  renderDefaultPixel,
} from './variants/default'
import {
  renderCircularMarker,
  renderCircularPixel,
} from './variants/circular'
import {
  renderRoundedMarker,
  renderRoundedPixel,
} from './variants/rounded'
import {
  renderPixelatedMarker,
  renderPixelatedPixel,
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
      return renderCircularPixel(result, border, size, color, radius, padding)
    case 'rounded':
      return renderRoundedPixel(result, border, size, color, radius)
    case 'pixelated':
      return renderPixelatedPixel(result, border, size, color)
    case 'default':
    default:
      return renderDefaultPixel(result, border, size, color)
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
      return renderCircularMarker(result, border, size, color, radius, padding)
    case 'rounded':
      return renderRoundedMarker(result, border, size, color, radius)
    case 'pixelated':
      return renderPixelatedMarker(result, border, size, color)
    case 'default':
    default:
      return renderDefaultMarker(result, border, size, color)
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

export function renderUtils(qrSize: number, qrBorder: number) {
  const innerSize = qrSize - qrBorder
  const markerSize = 7

  const markerPositions = [
    [qrBorder, qrBorder],
    [qrBorder, innerSize - markerSize],
    [innerSize - markerSize, qrBorder],
  ]

  const isInMarkerRange = (value: number, markerStart: number) =>
    value >= markerStart && value < markerStart + markerSize

  const isMarker = (row: number, col: number) =>
    markerPositions.some(([x, y]) =>
      isInMarkerRange(row, x) && isInMarkerRange(col, y),
    )

  const isMarkerCenter = (row: number, col: number) =>
    markerPositions.some(([x, y]) =>
      row >= x + 2 && row <= x + 4 && col >= y + 2 && col <= y + 4,
    )

  return {
    isTopLeft: (row: number, col: number) =>
      row < markerSize && col < markerSize,
    isTopRight: (row: number, col: number) =>
      row < markerSize && col >= innerSize - markerSize,
    isBottomLeft: (row: number, col: number) =>
      row >= innerSize - markerSize && col < markerSize,
    isMarker,
    isMarkerCenter,
    markerPositions,
    markerCenterPositions: markerPositions.map(([x, y]) => [x + 2, y + 2]),
  }
}
