import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import {
  getColors,
  limitInput,
} from '../render'

export function renderPixelsCircular(
  result: ReturnType<typeof encode>,
  size: number,
  color: string,
  radius: number,
  padding: number,
): string {
  let svg = ''

  // Clamp values between 0 and 1
  const clampedRadius = limitInput(radius)
  const clampedPadding = limitInput(padding)

  // Calculate the actual padding
  const actualPadding = (clampedPadding * size) / 2
  // Calculate the actual size of each pixel after padding
  const actualSize = size - 2 * actualPadding
  // Calculate the actual radius based on the percentage and half of the actual pixel size
  const actualRadius = (clampedRadius * actualSize) / 2

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      // Skip marker areas
      if ((row < 8 && (col < 8 || col >= result.size - 8)) || (row >= result.size - 8 && col < 8))
        continue

      if (result.data[row][col]) {
        const x = col * size + actualPadding
        const y = row * size + actualPadding
        svg += createCircularPixel(x, y, actualSize, actualRadius, color, padding)
      }
    }
  }
  return svg
}

export function renderMarkersCircular(
  result: ReturnType<typeof encode>,
  size: number,
  color: string,
  radius: number,
): string {
  let svg = ''
  const markerPositions = [
    [1, 1],
    [1, result.size - 8],
    [result.size - 8, 1],
  ]
  const clampedRadius = limitInput(radius)
  const actualRadius = (clampedRadius * size) / 2

  markerPositions.forEach(([row, col]) => {
    const ox = col * size + size / 2
    const oy = row * size + size / 2
    const cx = ox + size + size / 2
    const cy = oy + size + size / 2
    const outerSize = 7 * size - size
    const centerSize = 3 * size
    const rx = actualRadius * 7

    // Outer circle
    svg += `
      <rect x="${ox}" y="${oy}" width="${outerSize}" height="${outerSize}" rx="${rx}" fill="none" stroke="${color}" stroke-width="${size}"/>
    `

    // Center circle
    svg += createCircularPixel(cx, cy, centerSize, actualRadius * 3, color)
  })

  return svg
}

export function renderSVGCircular(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions & {
    radius?: number | {
      marker?: number
      pixel?: number
    }
    pixelPadding?: number
  } = {},
): string {
  const {
    radius,
    pixelSize = 10,
    pixelPadding = 0.1,
    invert,
    ...opts
  } = options

  const result = encode(data, opts)
  const { backgroundColor, foregroundColor } = getColors(options)
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  const pixelRadius = typeof radius === 'number' ? radius : radius?.pixel ?? 0.5
  const markerRadius = typeof radius === 'number' ? radius : radius?.marker ?? 0.5

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`
  svg += `<rect fill="${backgroundColor}" width="${width}" height="${height}"/>`

  svg += renderPixelsCircular(result, pixelSize, foregroundColor, pixelRadius, pixelPadding)
  svg += renderMarkersCircular(result, pixelSize, foregroundColor, markerRadius)

  svg += '</svg>'
  return svg
}

export function createCircularPixel(
  x: number,
  y: number,
  size: number,
  radius: number,
  color: string,
  padding: number = 0,
): string {
  const adjustedX = x + padding
  const adjustedY = y + padding
  const adjustedSize = size - 2 * padding

  return `<rect 
    x="${adjustedX}" 
    y="${adjustedY}" 
    width="${adjustedSize}" 
    height="${adjustedSize}" 
    rx="${radius}"
    fill="${color}"
  />`
}
