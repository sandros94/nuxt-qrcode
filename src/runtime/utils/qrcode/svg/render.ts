import type { QrCodeGenerateData, QrCodeGenerateSvgOptions } from 'uqr'
import { renderSVGStandard } from './variants/standard'
import { renderSVGCircular } from './variants/circular'
import { renderSVGRounded } from './variants/rounded'
import { renderSVGPixelated } from './variants/pixelated'

export type SVGVariant = 'standard' | 'circular' | 'rounded' | 'pixelated'

export interface RenderSVGOptions extends QrCodeGenerateSvgOptions {
  variant?: SVGVariant
  cornerRadius?: number
  pixelPadding?: number
}

export function renderSVG(
  data: QrCodeGenerateData,
  options: RenderSVGOptions = {},
): string {
  const { variant = 'standard', ...restOptions } = options

  switch (variant) {
    case 'circular':
      return renderSVGCircular(data, restOptions)
    case 'rounded':
      return renderSVGRounded(data, restOptions)
    case 'pixelated':
      return renderSVGPixelated(data, restOptions)
    case 'standard':
    default:
      return renderSVGStandard(data, restOptions)
  }
}

export function getColors(options: QrCodeGenerateSvgOptions): { backgroundColor: string, foregroundColor: string } {
  const { whiteColor = 'white', blackColor = 'black', invert = false } = options
  return {
    backgroundColor: invert ? blackColor : whiteColor,
    foregroundColor: invert ? whiteColor : blackColor,
  }
}