import type { encode } from 'uqr'

export function renderPixelsDefault(
  result: ReturnType<typeof encode>,
  pixelSize: number,
  foregroundColor: string,
): string {
  const pathes: string[] = []

  for (let row = 1; row < result.size - 1; row++) {
    for (let col = 1; col < result.size - 1; col++) {
      // Skip marker areas
      if ((row < 8 && (col < 8 || col >= result.size - 8)) || (row >= result.size - 8 && col < 8))
        continue

      const x = col * pixelSize
      const y = row * pixelSize
      if (result.data[row][col])
        pathes.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
    }
  }

  return `<path fill="${foregroundColor}" d="${pathes.join('')}" shape-rendering="crispEdges"/>`
}

export function renderMarkersDefault(
  result: ReturnType<typeof encode>,
  pixelSize: number,
  foregroundColor: string,
): string {
  const markerSize = 7 * pixelSize
  const markerPositions = [
    [pixelSize, pixelSize],
    [pixelSize, (result.size - 8) * pixelSize],
    [(result.size - 8) * pixelSize, pixelSize],
  ]

  return markerPositions.map(([x, y]) => {
    const outerPaths: string[] = []
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6) {
          const xi = x + i * pixelSize
          const yi = y + j * pixelSize
          outerPaths.push(`M${xi},${yi}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
        }
      }
    }

    return `<g shape-rendering="crispEdges">
  <path fill="${foregroundColor}" d="${outerPaths.join('')}"/>
  <rect x="${x + 2 * pixelSize}" y="${y + 2 * pixelSize}" width="${markerSize - 4 * pixelSize}" height="${markerSize - 4 * pixelSize}" fill="${foregroundColor}"/>
</g>`
  }).join('')
}
