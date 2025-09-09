import type { encode } from 'uqr'
import { renderUtils } from '../utils'

export function renderPixelatedPixel(
  result: ReturnType<typeof encode>,
  border: number,
  size: number,
  foregroundColor: string,
): string {
  const notchSize = size / 4
  const paths: string[] = []

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      // Skip marker areas
      if (!renderUtils(result.size, border).isMarker(row, col) && result.data[row]?.[col]) {
        const x = col * size
        const y = row * size

        paths.push(`M${x},${y}h${size}v${size}h-${size}z`)
        paths.push(addNotches(result.data, row, col, x, y, size, notchSize))
      }
    }
  }

  return `<g shape-rendering="crispEdges">
  <path fill="${foregroundColor}" d="${paths.join('')}"/>
</g>`
}

export function renderPixelatedMarkerOuter(
  x: number,
  y: number,
  size: number,
  color: string,
) {
  const notchSize = size / 4
  const outerPaths: string[] = []

  outerPaths.push(`M${x},${y}h${7 * size}v${7 * size}h-${7 * size}z M${x + 6 * size},${y + size}h-${5 * size}v${5 * size}h${5 * size}z M${x + notchSize},${y}h-${notchSize}v${notchSize}h${notchSize}z M${x + 7 * size},${y}h-${notchSize}v${notchSize}h${notchSize}z M${x},${y + 7 * size}h${notchSize}v-${notchSize}h-${notchSize}z M${x + 7 * size - notchSize},${y + 7 * size}h${notchSize}v-${notchSize}h-${notchSize}z`)

  return `<g shape-rendering="crispEdges">
  <path fill="${color}" d="${outerPaths.join('')}"/>
</g>`
}

export function renderPixelatedMarkerInner(
  x: number,
  y: number,
  size: number,
  color: string,
) {
  const notchSize = size / 4
  const outerPaths: string[] = []

  outerPaths.push(`M${x},${y}h${3 * size}v${3 * size}h-${3 * size}z M${x + notchSize},${y}h-${notchSize}v${notchSize}h${notchSize}z M${x + 3 * size},${y}h-${notchSize}v${notchSize}h${notchSize}z M${x},${y + 3 * size}h${notchSize}v-${notchSize}h-${notchSize}z M${x + 3 * size - notchSize},${y + 3 * size}h${notchSize}v-${notchSize}h-${notchSize}z`)

  return `<g shape-rendering="crispEdges">
  <path fill="${color}" d="${outerPaths.join('')}"/>
</g>`
}

function addNotches(
  data: boolean[][],
  row: number,
  col: number,
  x: number,
  y: number,
  size: number,
  notchSize: number,
) {
  const checkPixel = (r: number, c: number) => {
    if (r < 0 || r >= data.length || c < 0 || c >= data[0]!.length) return false
    return data[r]![c]
  }

  let notches = ''

  // Top-left corner
  if (!checkPixel(row - 1, col) && !checkPixel(row, col - 1)) {
    notches += `M${x + notchSize},${y}h-${notchSize}v${notchSize}h${notchSize}v-${notchSize}z`
  }

  // Top-right corner
  if (!checkPixel(row - 1, col) && !checkPixel(row, col + 1)) {
    notches += `M${x + notchSize * 2},${y}h${notchSize}v${notchSize}h${notchSize}v-${notchSize}z`
  }

  // Bottom-right corner
  if (!checkPixel(row + 0, col + 1) && !checkPixel(row + 1, col + 0)) {
    notches += `M${x + size},${y + size - notchSize}h-${notchSize}v${notchSize}h${notchSize}v-${notchSize}z`
  }

  // Bottom-left corner
  if (!checkPixel(row + 1, col) && !checkPixel(row + 0, col - 1)) {
    notches += `M${x + notchSize},${y + size - notchSize}h-${notchSize}v${notchSize}h${notchSize}v-${notchSize}z`
  }

  return notches
}
