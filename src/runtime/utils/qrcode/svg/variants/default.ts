import type { encode } from 'uqr'
import { renderUtils } from '../render'

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

export function renderDefaultMarker(
  result: ReturnType<typeof encode>,
  border: number,
  size: number,
  color: string,
): string {
  let svg = ''
  const { markerPositions } = renderUtils(result.size, border)

  markerPositions.forEach(([row, col]) => {
    const ox = col * size
    const oy = row * size
    const centerSize = 3 * size

    // Outer square
    const outerPaths: string[] = []
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6) {
          const xi = ox + i * size
          const yi = oy + j * size
          outerPaths.push(`M${xi},${yi}h${size}v${size}h-${size}z`)
        }
      }
    }

    // Center square
    const centerX = ox + 2 * size
    const centerY = oy + 2 * size

    svg += `<g shape-rendering="crispEdges">
  <path fill="${color}" d="${outerPaths.join('')}"/>
  <rect x="${centerX}" y="${centerY}" width="${centerSize}" height="${centerSize}" fill="${color}"/>
</g>`
  })

  return svg
}
