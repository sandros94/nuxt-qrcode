import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import { getColors } from '../render'

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

  const notchSize = pixelSize / 4
  const paths: string[] = []
  const notches: string[] = []

  const isFinderPatternCenter = (row: number, col: number) => {
    const finderPatternCenters = [
      [3, 3], [3, result.size - 6], [result.size - 6, 3],
    ]
    return finderPatternCenters.some(([r, c]) =>
      row >= r && row < r + 3 && col >= c && col < c + 3,
    )
  }

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      if (result.data[row][col]) {
        const x = col * pixelSize
        const y = row * pixelSize

        if (isFinderPatternCenter(row, col)) {
          if (row % 3 === 0 && col % 3 === 0) {
            paths.push(`M${x},${y}h${pixelSize * 3}v${pixelSize * 3}h-${pixelSize * 3}z`)
            addNotches(notches, x, y, pixelSize * 3, notchSize * 2, row, col, result.data, true)
          }
          continue
        }

        paths.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
        addNotches(notches, x, y, pixelSize, notchSize, row, col, result.data)
      }
    }
  }

  svg += `<path fill="${foregroundColor}" d="${paths.join('')}"/>`
  svg += `<path fill="${backgroundColor}" d="${notches.join('')}"/>`

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
