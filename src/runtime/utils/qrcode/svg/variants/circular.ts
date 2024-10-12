import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import { getColors } from '../render'

export function renderSVGCircular(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions & { cornerRadius?: number, pixelPadding?: number } = {},
): string {
  const {
    pixelSize = 10,
    cornerRadius = 0.5,
    pixelPadding = 0.1,
    invert,
    ...opts
  } = options
  const result = encode(data, opts)
  const { backgroundColor, foregroundColor } = getColors(options)
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  // Clamp cornerRadius and pixelPadding between 0 and 1
  const clampedCornerRadius = Math.max(0, Math.min(1, cornerRadius))
  const clampedPixelPadding = Math.max(0, Math.min(1, pixelPadding))

  // Calculate the actual padding
  const actualPadding = (clampedPixelPadding * pixelSize) / 2
  // Calculate the actual size of each pixel after padding
  const actualPixelSize = pixelSize - 2 * actualPadding
  // Calculate the actual radius based on the percentage and half of the actual pixel size
  const actualRadius = (clampedCornerRadius * actualPixelSize) / 2

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`

  svg += `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`

  // Helper function to check if a position is part of a finder pattern center
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
        if (isFinderPatternCenter(row, col)) {
          // If it's a finder pattern center, draw a 3x3 pixel without padding
          if (row % 3 === 0 && col % 3 === 0) {
            const x = col * pixelSize
            const y = row * pixelSize
            const size = 3 * pixelSize
            // Calculate a new radius for the 3x3 pixel
            const finderCenterRadius = (clampedCornerRadius * size) / 2
            svg += createCircularPixel(x, y, size, finderCenterRadius, foregroundColor)
          }
          // Skip the other cells of the finder pattern center
          continue
        }

        const x = col * pixelSize + actualPadding
        const y = row * pixelSize + actualPadding
        svg += createCircularPixel(x, y, actualPixelSize, actualRadius, foregroundColor)
      }
    }
  }

  svg += '</svg>'
  return svg
}

function createCircularPixel(
  x: number,
  y: number,
  size: number,
  radius: number,
  color: string,
): string {
  const curve = radius * (4 / 3) * Math.tan(Math.PI / 8)

  let path = `<path fill="${color}" d="`

  // Top-left corner
  path += `M${x},${y + radius}`
  path += `C${x},${y + radius - curve} ${x + radius - curve},${y} ${x + radius},${y}`

  // Top-right corner
  path += `L${x + size - radius},${y}`
  path += `C${x + size - radius + curve},${y} ${x + size},${y + radius - curve} ${x + size},${y + radius}`

  // Bottom-right corner
  path += `L${x + size},${y + size - radius}`
  path += `C${x + size},${y + size - radius + curve} ${x + size - radius + curve},${y + size} ${x + size - radius},${y + size}`

  // Bottom-left corner
  path += `L${x + radius},${y + size}`
  path += `C${x + radius - curve},${y + size} ${x},${y + size - radius + curve} ${x},${y + size - radius}`

  path += 'Z"/>'

  return path
}
