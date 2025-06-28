export type * from 'barcode-detector'
export type * from '../utils/qrcode/svg/render'

// Export props types for read components
export type * from './components'

export type BarcodeFormats = Record<BarcodeFormat, boolean | undefined>
