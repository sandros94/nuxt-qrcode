import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import { getColors } from '../render'

export function renderPixelsStandard(
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

export function renderMarkersStandard(
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

export function renderSVGStandard(
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

  svg += renderPixelsStandard(result, pixelSize, foregroundColor)
  svg += renderMarkersStandard(result, pixelSize, foregroundColor)

  svg += '</svg>'
  return svg
}
