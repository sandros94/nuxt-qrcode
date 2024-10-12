import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { encode } from 'uqr'

/**
 * Renders a QR code as an SVG string.
 * The function converts the input data into a QR code and then generates an SVG representation using the specified colours and pixel sizes.
 * @param {QrCodeGenerateData} data - The data to encode into the QR code. See {@link QrCodeGenerateData}.
 * @param {QrCodeGenerateSvgOptions} [options] - Options to render the QR code in SVG format, including pixel size and colours for modules. optional. See {@link QrCodeGenerateSvgOptions}.
 * @returns {string} An SVG string representing the QR code.
 */
export function renderSVG(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions = {},
): string {
  const result = encode(data, options)
  const {
    pixelSize = 10,
    whiteColor = 'white',
    blackColor = 'black',
  } = options
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`

  const pathes: string[] = []

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const x = col * pixelSize
      const y = row * pixelSize
      if (result.data[row][col])
        pathes.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
    }
  }

  svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`
  svg += `<path fill="${blackColor}" d="${pathes.join('')}"/>`

  svg += '</svg>'
  return svg
}

export function renderSVGRounded(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions & { cornerRadius?: number } = {},
): string {
  const result = encode(data, options)
  const {
    pixelSize = 10,
    whiteColor = 'white',
    blackColor = 'black',
    cornerRadius = 0,
  } = options
  const height = result.size * pixelSize
  const width = result.size * pixelSize

  // Clamp cornerRadius between 0 and 1
  const clampedCornerRadius = Math.max(0, Math.min(1, cornerRadius))
  // Calculate the actual radius based on the percentage and half of the pixel size
  const actualRadius = (clampedCornerRadius * pixelSize) / 2

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`

  const paths: string[] = []
  const visited: boolean[][] = Array(result.size).fill(null).map(() => Array(result.size).fill(false))

  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      if (result.data[row][col] && !visited[row][col]) {
        const path = tracePath(result.data, visited, row, col, pixelSize, actualRadius)
        if (path) paths.push(path)
      }
    }
  }

  svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`
  svg += `<path fill="${blackColor}" d="${paths.join(' ')}"/>`

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
