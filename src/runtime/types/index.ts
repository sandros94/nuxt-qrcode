import type { SVGAttributes } from 'vue'
import type { QrCodeGenerateData } from 'uqr'
import type { RenderSVGOptions } from '../utils/qrcode/svg/render'

export type * from 'barcode-detector'
export type * from '../utils/qrcode/svg/render'

// Export props types for read components
export type * from '../components/qrcode-capture'
export type * from '../components/qrcode-drop-zone'
export type * from '../components/qrcode-stream'

export type BarcodeFormats = Record<BarcodeFormat, boolean | undefined>

type _SVGAttributes = Pick<SVGAttributes, 'width' | 'height' | 'preserveAspectRatio'>
export interface QrcodeProps extends RenderSVGOptions, _SVGAttributes {
  value: QrCodeGenerateData
}
