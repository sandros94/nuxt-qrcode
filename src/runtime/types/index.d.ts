import type { SVGAttributes } from 'vue'
import type { QrCodeGenerateData } from 'uqr'
import type { RenderSVGOptions } from '../utils/qrcode/svg/render'

export type * from 'barcode-detector'
export type * from '../utils/qrcode/svg/render'

export type BarcodeFormats = Record<BarcodeFormat, boolean | undefined>

type _SVGAttributes = Pick<SVGAttributes, 'width' | 'height' | 'preserveAspectRatio'>
export interface QrcodeProps extends RenderSVGOptions, _SVGAttributes {
  value: QrCodeGenerateData
}
