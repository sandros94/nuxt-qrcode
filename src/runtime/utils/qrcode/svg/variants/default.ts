import type { encode } from 'uqr'
import { renderUtils } from '../utils'

export function renderDefaultPixel(
  result: ReturnType<typeof encode>,
  border: number,
  size: number,
  color: string,
): string {
  const pixelPaths: string[] = []

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      // Skip marker areas
      if (!renderUtils(result.size, border).isMarker(row, col) && result.data[row][col]) {
        const x = col * size
        const y = row * size
        pixelPaths.push(`M${x},${y}h${size}v${size}h-${size}z`)
      }
    }
  }

  return `<path fill="${color}" d="${pixelPaths.join('')}" shape-rendering="crispEdges"/>`
}

export function renderDefaultMarkerOuter(
  x: number,
  y: number,
  size: number,
  color: string,
) {
  const outerPaths: string[] = []

  outerPaths.push(`M${x},${y}h${7 * size}v${7 * size}h-${7 * size}z M${x + 6 * size},${y + size}h-${5 * size}v${5 * size}h${5 * size}z`)

  return `<path fill="${color}" d="${outerPaths.join('')}"/>`
}

export function renderDefaultMarkerInner(
  x: number,
  y: number,
  size: number,
  color: string,
) {
  return `<rect x="${x}" y="${y}" width="${3 * size}" height="${3 * size}" fill="${color}"/>`
}
