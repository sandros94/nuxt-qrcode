import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import { getColors } from '../render'

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

  const pathes: string[] = []

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const x = col * pixelSize
      const y = row * pixelSize
      if (result.data[row][col])
        pathes.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
    }
  }

  svg += `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`
  svg += `<path fill="${foregroundColor}" d="${pathes.join('')}"/>`

  svg += '</svg>'
  return svg
}
