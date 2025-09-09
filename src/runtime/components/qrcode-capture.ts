import type { ComponentObjectPropsOptions } from 'vue'
import type { BarcodeFormat, QrcodeCaptureProps, DetectedBarcode } from 'vue-qrcode-reader'
import { QrcodeCapture } from 'vue-qrcode-reader'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export type { QrcodeCaptureProps }

export interface QrcodeCaptureEmits {
  (e: 'detect', detectedCodes: DetectedBarcode[]): void
}

export default defineComponent<QrcodeCaptureProps, ComponentObjectPropsOptions, string, QrcodeCaptureEmits>({
  name: 'QrcodeCapture',
  emits: ['detect'],
  setup(props, { attrs }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
      .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[]
    // TODO: check upstream if above filter is still needed

    return () => h(QrcodeCapture, {
      ...props,
      ...attrs,
      formats,
    })
  },
})
