import type { BarcodeFormat as BFormat } from 'barcode-detector'

export type { DetectedBarcode, Point2D } from 'barcode-detector'

export type * from '../utils/qrcode/svg/render'

// Export props types for read components
export type * from './components'

export type BarcodeFormat = Exclude<BFormat, 'databar_limited' | 'any'>
export type BarcodeFormats = Record<BarcodeFormat, boolean | undefined>
