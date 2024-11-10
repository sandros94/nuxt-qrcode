import type { encode } from 'uqr'
import { renderUtils } from '../render'

export function renderPixelatedPixel(
  result: ReturnType<typeof encode>,
  border: number,
  pixelSize: number,
  foregroundColor: string,
): string {
  const notchSize = pixelSize / 4
  const paths: string[] = []
  const notches: string[] = []

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      // Skip marker areas
      if (!renderUtils(result.size, border).isMarker(row, col) && result.data[row][col]) {
        const x = col * pixelSize
        const y = row * pixelSize

        paths.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
        addNotches(notches, x, y, pixelSize, notchSize, row, col, result.data)
      }
    }
  }

  // TODO: fix with mask
  return `<g shape-rendering="crispEdges">
  <path fill="${foregroundColor}" d="${paths.join('')}"/>
  <path fill="white" d="${notches.join('')}"/>
</g>`
}

export function renderPixelatedMarker(
  result: ReturnType<typeof encode>,
  border: number,
  pixelSize: number,
  foregroundColor: string,
): string {
  const notchSize = pixelSize / 4
  const paths: string[] = []
  const notches: string[] = []

  const { markerPositions } = renderUtils(result.size, border)

  markerPositions.forEach(([row, col]) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const x = (col + j) * pixelSize
        const y = (row + i) * pixelSize

        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          paths.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
          addNotches(notches, x, y, pixelSize, notchSize, row + i, col + j, result.data)
        }
      }
    }
  })

  // TODO: fix with mask
  return `<g shape-rendering="crispEdges">
  <path fill="${foregroundColor}" d="${paths.join('')}"/>
  <path fill="white" d="${notches.join('')}"/>
</g>`
}

function addNotches(
  notches: string[],
  x: number,
  y: number,
  size: number,
  notchSize: number,
  row: number,
  col: number,
  data: boolean[][],
  isFinderCenter: boolean = false,
) {
  const checkPixel = (r: number, c: number) => {
    if (r < 0 || r >= data.length || c < 0 || c >= data[0].length) return false
    return data[r][c]
  }

  const addNotch = (startX: number, startY: number) => {
    notches.push(`M${startX},${startY}h${notchSize}v${notchSize}h-${notchSize}z`)
  }

  // Top-left corner
  if (!checkPixel(row - 1, col) && !checkPixel(row, col - 1)) {
    addNotch(x, y)
  }

  // Top-right corner
  if (!checkPixel(row - 1, col + (isFinderCenter ? 2 : 0)) && !checkPixel(row, col + (isFinderCenter ? 3 : 1))) {
    addNotch(x + size - notchSize, y)
  }

  // Bottom-right corner
  if (!checkPixel(row + (isFinderCenter ? 2 : 0), col + (isFinderCenter ? 3 : 1)) && !checkPixel(row + (isFinderCenter ? 3 : 1), col + (isFinderCenter ? 2 : 0))) {
    addNotch(x + size - notchSize, y + size - notchSize)
  }

  // Bottom-left corner
  if (!checkPixel(row + (isFinderCenter ? 3 : 1), col) && !checkPixel(row + (isFinderCenter ? 2 : 0), col - 1)) {
    addNotch(x, y + size - notchSize)
  }
}
