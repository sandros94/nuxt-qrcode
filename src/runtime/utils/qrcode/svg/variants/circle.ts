import {
  limitInput,
  DEFAULT_RADIUS,
} from '../utils'
import {
  createDotPixel,
} from './dots'

export function renderCircleMarkerOuter(
  x: number,
  y: number,
  size: number,
  color: string,
  radius: number = DEFAULT_RADIUS,
): string {
  const clampedRadius = limitInput(radius)
  const _size = 6 * size
  // Calculate the maximum possible radius for the outer square
  const maxOuterRadius = _size / 2
  // Apply the clampedRadius (0-1) to the maximum possible radius
  const outerRadius = clampedRadius * maxOuterRadius

  return `<rect x="${x + size / 2}" y="${y + size / 2}" width="${_size}" height="${_size}" rx="${outerRadius}" fill="none" stroke="${color}" stroke-width="${size}"/>`
}

export function renderCircleMarkerInner(
  x: number,
  y: number,
  size: number,
  color: string,
  radius: number = DEFAULT_RADIUS,
): string {
  const clampedRadius = limitInput(radius)

  const _size = size * 3
  return createDotPixel(x, y, _size, (clampedRadius * _size) / 2, color)
}
