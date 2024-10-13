import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'
import {
  getColors,
  limitInput,
} from '../render'
import { createCircularPixel } from './circular'

export function renderPixelsRounded(
  result: ReturnType<typeof encode>,
  size: number,
  color: string,
  radius: number,
): string {
  const paths: string[] = []
  const visited: boolean[][] = Array(result.size).fill(null).map(() => Array(result.size).fill(false))
  const clampedRadius = limitInput(radius)
  const actualRadius = (clampedRadius * size) / 2

  for (let row = 1; row < result.size - 1; row++) {
    for (let col = 1; col < result.size - 1; col++) {
      // Skip marker areas
      if ((row < 8 && (col < 8 || col >= result.size - 8)) || (row >= result.size - 8 && col < 8))
        continue

      if (result.data[row][col] && !visited[row][col]) {
        const path = tracePath(result.data, visited, row, col, size, actualRadius)
        if (path) paths.push(path)
      }
    }
  }

  return `<path fill="${color}" d="${paths.join(' ')}"/>`
}

export function renderMarkersRounded(
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

export function renderSVGRounded(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions & {
    radius?: number | {
      marker?: number
      pixel?: number
    }
  } = {},
): string {
  const {
    radius,
    pixelSize = 10,
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

  svg += renderPixelsRounded(result, pixelSize, foregroundColor, pixelRadius)
  svg += renderMarkersRounded(result, pixelSize, foregroundColor, markerRadius)

  svg += '</svg>'
  return svg
}

function tracePath(
  data: boolean[][],
  visited: boolean[][],
  startRow: number,
  startCol: number,
  pixelSize: number,
  cornerRadius: number,
): string {
  const path: string[] = []
  const stack: [number, number][] = [[startRow, startCol]]

  while (stack.length > 0) {
    const [row, col] = stack.pop()!
    if (row < 0 || row >= data.length || col < 0 || col >= data[0].length || !data[row][col] || visited[row][col]) {
      continue
    }

    visited[row][col] = true

    const x = col * pixelSize
    const y = row * pixelSize

    const top = row > 0 && data[row - 1][col]
    const right = col < data[0].length - 1 && data[row][col + 1]
    const bottom = row < data.length - 1 && data[row + 1][col]
    const left = col > 0 && data[row][col - 1]

    path.push(createPixelPath(x, y, pixelSize, cornerRadius, { top, right, bottom, left }))

    stack.push([row - 1, col], [row, col + 1], [row + 1, col], [row, col - 1])
  }

  return path.join(' ')
}

function createPixelPath(
  x: number,
  y: number,
  size: number,
  radius: number,
  { top, right, bottom, left }: { top: boolean, right: boolean, bottom: boolean, left: boolean },
): string {
  const commands: string[] = []
  const curve = radius * (4 / 3) * Math.tan(Math.PI / 8)

  // Top-left corner
  if (!left && !top) {
    commands.push(`M${x},${y + radius}`)
    commands.push(`C${x},${y + radius - curve} ${x + radius - curve},${y} ${x + radius},${y}`)
  }
  else {
    commands.push(`M${x},${y}`)
  }

  // Top-right corner
  if (!top && !right) {
    commands.push(`L${x + size - radius},${y}`)
    commands.push(`C${x + size - radius + curve},${y} ${x + size},${y + radius - curve} ${x + size},${y + radius}`)
  }
  else {
    commands.push(`L${x + size},${y}`)
  }

  // Bottom-right corner
  if (!right && !bottom) {
    commands.push(`L${x + size},${y + size - radius}`)
    commands.push(`C${x + size},${y + size - radius + curve} ${x + size - radius + curve},${y + size} ${x + size - radius},${y + size}`)
  }
  else {
    commands.push(`L${x + size},${y + size}`)
  }

  // Bottom-left corner
  if (!bottom && !left) {
    commands.push(`L${x + radius},${y + size}`)
    commands.push(`C${x + radius - curve},${y + size} ${x},${y + size - radius + curve} ${x},${y + size - radius}`)
  }
  else {
    commands.push(`L${x},${y + size}`)
  }

  commands.push('Z')

  return commands.join(' ')
}
