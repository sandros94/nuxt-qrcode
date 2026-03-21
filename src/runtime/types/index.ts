import type { BarcodeFormat as BFormat } from 'vue-qrcode-reader'

export type { BarcodeFormat, DetectedBarcode } from 'vue-qrcode-reader'

export interface Point2D {
  x: number
  y: number
}

export type * from '../utils/qrcode/svg/render'

// Export props types for read components
export type * from './components'

export type BarcodeFormats = Record<BFormat, boolean | undefined>
