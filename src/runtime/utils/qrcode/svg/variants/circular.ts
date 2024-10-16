import type { encode } from 'uqr'
import { limitInput } from '../render'

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
  padding: number,
): string {
  let svg = ''
  const markerPositions = [
    [1, 1],
    [1, result.size - 8],
    [result.size - 8, 1],
  ]

  // Clamp values between 0 and 1
  const clampedRadius = limitInput(radius)
  const clampedPadding = limitInput(padding)

  // Calculate the actual padding
  const actualPadding = (clampedPadding * size) / 2
  // Calculate the actual size of each pixel after padding
  const actualSize = size - 2 * actualPadding
  // Calculate the actual radius based on the percentage and half of the actual pixel size
  const actualRadius = (clampedRadius * actualSize) / 2

  markerPositions.forEach(([row, col]) => {
    const x = col * size
    const y = row * size
    const centerSize = 3 * size

    // Render outer pixels
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        // Skip center 3x3 area
        if (i >= 1 && i <= 5 && j >= 1 && j <= 5) continue

        const pixelX = x + i * size
        const pixelY = y + j * size
        svg += createCircularPixel(pixelX, pixelY, size, actualRadius, color, actualPadding)
      }
    }

    // Center circle
    svg += createCircularPixel(x + 2 * size, y + 2 * size, centerSize, actualRadius * 4, color)
  })

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
