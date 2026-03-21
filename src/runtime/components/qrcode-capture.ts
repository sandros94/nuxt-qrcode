import type { ComponentObjectPropsOptions } from 'vue'
import type {
  QrcodeCaptureProps as _QrcodeCaptureProps,
} from 'vue-qrcode-reader'
import { QrcodeCapture } from 'vue-qrcode-reader'

import { defineComponent, h, useRuntimeConfig } from '#imports'
import type { BarcodeFormat, DetectedBarcode } from '../types'

export interface QrcodeCaptureProps extends Omit<_QrcodeCaptureProps, 'formats'> {
  formats?: BarcodeFormat[]
}

export interface QrcodeCaptureEmits {
  (e: 'detect', detectedCodes: DetectedBarcode[]): void
}

export default defineComponent<QrcodeCaptureProps, ComponentObjectPropsOptions, string, QrcodeCaptureEmits>({
  name: 'QrcodeCapture',
  emits: ['detect'],
  setup(props, { attrs }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats) as BarcodeFormat[]

    return () => h(QrcodeCapture, {
      ...props,
      ...attrs,
      // @ts-expect-error - upstream type missing `aztec_code` format
      formats,
    })
  },
})
