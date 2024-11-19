import type { encode } from 'uqr'
import {
  limitInput,
  renderUtils,
} from '../utils'

export function renderRoundedPixel(
  result: ReturnType<typeof encode>,
  border: number,
  size: number,
  color: string,
  radius: number,
): string {
  const paths: string[] = []
  const visited: boolean[][] = Array(result.size).fill(null).map(() => Array(result.size).fill(false))
  const clampedRadius = limitInput(radius)
  const actualRadius = (clampedRadius * size) / 2

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      // Skip marker areas
      if (!renderUtils(result.size, border).isMarker(row, col) && result.data[row][col] && !visited[row][col]) {
        paths.push(tracePath(result.data, visited, row, col, size, actualRadius))
      }
    }
  }

  return `<path fill="${color}" d="${paths.join(' ')}"/>`
}

export function renderRoundedMarkerOuter(
  x: number,
  y: number,
  size: number,
  color: string,
  radius: number,
): string {
  const clampedRadius = limitInput(radius)
  const actualRadius = (clampedRadius * size) / 2

  const outerPath = createRoundedRectPath(x, y, 7 * size, 7 * size, actualRadius)
  const innerPath = createReversedRoundedRectPath(x + size, y + size, 5 * size, 5 * size, actualRadius)

  return `<path fill="${color}" d="${outerPath} ${innerPath}"/>`
}

export function renderRoundedMarkerInner(
  x: number,
  y: number,
  size: number,
  color: string,
  radius: number,
): string {
  const clampedRadius = limitInput(radius)
  const actualRadius = (clampedRadius * size) / 2

  const path = createRoundedRectPath(x, y, 3 * size, 3 * size, actualRadius)

  return `<path fill="${color}" d="${path}"/>`
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
  const adjustedRadius = Math.min(radius, size / 2)
  const curve = adjustedRadius * (4 / 3) * Math.tan(Math.PI / 8)

  // Top-left corner
  if (!left && !top) {
    commands.push(`M${x},${y + adjustedRadius}`)
    commands.push(`C${x},${y + adjustedRadius - curve} ${x + adjustedRadius - curve},${y} ${x + adjustedRadius},${y}`)
  }
  else {
    commands.push(`M${x},${y}`)
  }

  // Top-right corner
  if (!top && !right) {
    commands.push(`L${x + size - adjustedRadius},${y}`)
    commands.push(`C${x + size - adjustedRadius + curve},${y} ${x + size},${y + adjustedRadius - curve} ${x + size},${y + adjustedRadius}`)
  }
  else {
    commands.push(`L${x + size},${y}`)
  }

  // Bottom-right corner
  if (!right && !bottom) {
    commands.push(`L${x + size},${y + size - adjustedRadius}`)
    commands.push(`C${x + size},${y + size - adjustedRadius + curve} ${x + size - adjustedRadius + curve},${y + size} ${x + size - adjustedRadius},${y + size}`)
  }
  else {
    commands.push(`L${x + size},${y + size}`)
  }

  // Bottom-left corner
  if (!bottom && !left) {
    commands.push(`L${x + adjustedRadius},${y + size}`)
    commands.push(`C${x + adjustedRadius - curve},${y + size} ${x},${y + size - adjustedRadius + curve} ${x},${y + size - adjustedRadius}`)
  }
  else {
    commands.push(`L${x},${y + size}`)
  }

  commands.push('Z')

  return commands.join(' ')
}

function createRoundedRectPath(x: number, y: number, width: number, height: number, radius: number): string {
  const adjustedRadius = Math.min(radius, Math.min(width, height) / 2)
  const curve = adjustedRadius * (4 / 3) * Math.tan(Math.PI / 8)

  return [
    `M${x + adjustedRadius},${y}`,
    `H${x + width - adjustedRadius}`,
    `C${x + width - adjustedRadius + curve},${y} ${x + width},${y + adjustedRadius - curve} ${x + width},${y + adjustedRadius}`,
    `V${y + height - adjustedRadius}`,
    `C${x + width},${y + height - adjustedRadius + curve} ${x + width - adjustedRadius + curve},${y + height} ${x + width - adjustedRadius},${y + height}`,
    `H${x + adjustedRadius}`,
    `C${x + adjustedRadius - curve},${y + height} ${x},${y + height - adjustedRadius + curve} ${x},${y + height - adjustedRadius}`,
    `V${y + adjustedRadius}`,
    `C${x},${y + adjustedRadius - curve} ${x + adjustedRadius - curve},${y} ${x + adjustedRadius},${y}`,
    'Z',
  ].join(' ')
}

function createReversedRoundedRectPath(x: number, y: number, width: number, height: number, radius: number): string {
  const adjustedRadius = Math.min(radius, Math.min(width, height) / 2)
  const curve = adjustedRadius * (4 / 3) * Math.tan(Math.PI / 8)

  return [
    `M${x + width - adjustedRadius},${y}`,
    `H${x + adjustedRadius}`,
    `C${x + adjustedRadius - curve},${y} ${x},${y + adjustedRadius - curve} ${x},${y + adjustedRadius}`,
    `V${y + height - adjustedRadius}`,
    `C${x},${y + height - adjustedRadius + curve} ${x + adjustedRadius - curve},${y + height} ${x + adjustedRadius},${y + height}`,
    `H${x + width - adjustedRadius}`,
    `C${x + width - adjustedRadius + curve},${y + height} ${x + width},${y + height - adjustedRadius + curve} ${x + width},${y + height - adjustedRadius}`,
    `V${y + adjustedRadius}`,
    `C${x + width},${y + adjustedRadius - curve} ${x + width - adjustedRadius + curve},${y} ${x + width - adjustedRadius},${y}`,
    'Z',
  ].join(' ')
}
