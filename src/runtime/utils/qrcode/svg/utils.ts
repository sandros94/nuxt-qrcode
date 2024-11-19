import type { QrCodeGenerateResult, QrCodeGenerateSvgOptions } from 'uqr'
import type { RenderSVGOptions, SVGVariant } from './render'

export function getColors(options: QrCodeGenerateSvgOptions) {
  const { whiteColor = 'white', blackColor = 'black', invert = false } = options
  return {
    backgroundColor: invert ? blackColor : whiteColor,
    foregroundColor: invert ? whiteColor : blackColor,
  }
}

export function getSize(size: QrCodeGenerateResult['size'], pixelSize: number = DEFAULT_PIXEL_SIZE) {
  return {
    height: size * pixelSize,
    width: size * pixelSize,
  }
}

export function getRadius(radius: RenderSVGOptions['radius'], defRadius: number = DEFAULT_RADIUS) {
  const pixelRadius = typeof radius === 'number' ? radius : radius?.pixel ?? defRadius
  const outer = typeof radius === 'number' ? radius : radius?.marker ?? defRadius
  const inner = typeof radius === 'number' ? radius : radius?.inner ?? outer

  return {
    pixelRadius,
    markerRadius: {
      outer,
      inner,
    },
  }
}

export function getVariant(variant: RenderSVGOptions['variant'], defVariant: SVGVariant = 'default') {
  const pixelVariant = typeof variant === 'string' ? variant : variant?.pixel || defVariant
  const outer = typeof variant === 'string' ? variant : variant?.marker || defVariant
  const inner = typeof variant === 'string' ? variant : variant?.inner || outer

  return {
    pixelVariant,
    markerVariant: {
      outer,
      inner,
    },
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

export const DEFAULT_RADIUS = 0.5
export const DEFAULT_PADDING = 0.1
export const DEFAULT_PIXEL_SIZE = 20
