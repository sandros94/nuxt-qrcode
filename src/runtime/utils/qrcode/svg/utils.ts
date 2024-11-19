import type { QrCodeGenerateSvgOptions } from 'uqr'

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
