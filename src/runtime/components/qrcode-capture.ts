import type { BarcodeFormat, QrcodeCaptureProps } from 'vue-qrcode-reader'
import { QrcodeCapture } from 'vue-qrcode-reader'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export type { QrcodeCaptureProps }

export default defineComponent<QrcodeCaptureProps>({
  name: 'QrcodeCapture',
  inheritAttrs: false,
  setup(props, { attrs, slots }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
      .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[]
    // TODO: check upstream if above filter is still needed

    return () => h(QrcodeCapture, {
      ...attrs,
      formats,
    }, slots)
  },
})
