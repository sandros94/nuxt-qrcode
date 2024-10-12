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

  svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`
  svg += `<path fill="${blackColor}" d="${pathes.join('')}"/>`

  svg += '</svg>'
  return svg
}

export function renderSVGCircular(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions & { cornerRadius?: number, pixelPadding?: number } = {},
): string {
  const result = encode(data, options)
  const {
    pixelSize = 10,
    whiteColor = 'white',
    blackColor = 'black',
    cornerRadius = 0,
    pixelPadding = 0.1,
  } = options
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

  svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`

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
            svg += createCircularPixel(x, y, size, finderCenterRadius, blackColor)
          }
          // Skip the other cells of the finder pattern center
          continue
        }

        const x = col * pixelSize + actualPadding
        const y = row * pixelSize + actualPadding
        svg += createCircularPixel(x, y, actualPixelSize, actualRadius, blackColor)
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

export function renderSVGRounded(
  data: QrCodeGenerateData,
  options: QrCodeGenerateSvgOptions & { cornerRadius?: number } = {},
): string {
  const result = encode(data, options)
  const {
    pixelSize = 10,
    whiteColor = 'white',
    blackColor = 'black',
    cornerRadius = 0.5,
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

export function renderSVGPixelated(
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

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`

  svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`

  const notchSize = pixelSize / 4
  const paths: string[] = []
  const notches: string[] = []

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
        const x = col * pixelSize
        const y = row * pixelSize

        if (isFinderPatternCenter(row, col)) {
          if (row % 3 === 0 && col % 3 === 0) {
            paths.push(`M${x},${y}h${pixelSize * 3}v${pixelSize * 3}h-${pixelSize * 3}z`)
            addNotches(notches, x, y, pixelSize * 3, notchSize * 2, row, col, result.data, true)
          }
          continue
        }

        paths.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
        addNotches(notches, x, y, pixelSize, notchSize, row, col, result.data)
      }
    }
  }

  svg += `<path fill="${blackColor}" d="${paths.join('')}"/>`
  svg += `<path fill="${whiteColor}" d="${notches.join('')}"/>`

  svg += '</svg>'
  return svg
}

function addNotches(
  notches: string[],
  x: number,
  y: number,
  size: number,
  notchSize: number,
  row: number,
  col: number,
  data: boolean[][],
  isFinderCenter: boolean = false,
) {
  const checkPixel = (r: number, c: number) => {
    if (r < 0 || r >= data.length || c < 0 || c >= data[0].length) return false
    return data[r][c]
  }

  const addNotch = (startX: number, startY: number) => {
    notches.push(`M${startX},${startY}h${notchSize}v${notchSize}h-${notchSize}z`)
  }

  // Top-left corner
  if (!checkPixel(row - 1, col) && !checkPixel(row, col - 1)) {
    addNotch(x, y)
  }

  // Top-right corner
  if (!checkPixel(row - 1, col + (isFinderCenter ? 2 : 0)) && !checkPixel(row, col + (isFinderCenter ? 3 : 1))) {
    addNotch(x + size - notchSize, y)
  }

  // Bottom-right corner
  if (!checkPixel(row + (isFinderCenter ? 2 : 0), col + (isFinderCenter ? 3 : 1)) && !checkPixel(row + (isFinderCenter ? 3 : 1), col + (isFinderCenter ? 2 : 0))) {
    addNotch(x + size - notchSize, y + size - notchSize)
  }

  // Bottom-left corner
  if (!checkPixel(row + (isFinderCenter ? 3 : 1), col) && !checkPixel(row + (isFinderCenter ? 2 : 0), col - 1)) {
    addNotch(x, y + size - notchSize)
  }
}
