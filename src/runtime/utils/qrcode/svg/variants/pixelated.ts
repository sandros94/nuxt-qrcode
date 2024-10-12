import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import { getColors } from '../render'

function renderPixelsPixelated(
  result: ReturnType<typeof encode>,
  pixelSize: number,
  foregroundColor: string,
): string {
  const notchSize = pixelSize / 4
  const paths: string[] = []
  const notches: string[] = []

  for (let row = 1; row < result.size - 1; row++) {
    for (let col = 1; col < result.size - 1; col++) {
      // Skip marker areas
      if ((row < 8 && (col < 8 || col >= result.size - 8)) || (row >= result.size - 8 && col < 8))
        continue

      if (result.data[row][col]) {
        const x = col * pixelSize
        const y = row * pixelSize

        paths.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
        addNotches(notches, x, y, pixelSize, notchSize, row, col, result.data)
      }
    }
  }

  // TODO: fix with mask
  return `
    <path fill="${foregroundColor}" d="${paths.join('')}"/>
    <path fill="white" d="${notches.join('')}"/>
  `
}

function renderMarkersPixelated(
  result: ReturnType<typeof encode>,
  pixelSize: number,
  foregroundColor: string,
): string {
  const notchSize = pixelSize / 4
  const paths: string[] = []
  const notches: string[] = []

  const markerPositions = [
    [1, 1],
    [1, result.size - 8],
    [result.size - 8, 1],
  ]

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
  return `
    <path fill="${foregroundColor}" d="${paths.join('')}"/>
    <path fill="white" d="${notches.join('')}"/>
  `
}

export function renderSVGPixelated(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions = {},
): string {
  const {
    pixelSize = 10,
    invert,
    ...opts
  } = options
  const result = encode(data, opts)
  const { backgroundColor, foregroundColor } = getColors(options)
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`

  svg += `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`
  svg += renderPixelsPixelated(result, pixelSize, foregroundColor)
  svg += renderMarkersPixelated(result, pixelSize, foregroundColor)

  svg += '</svg>'
  return svg
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
