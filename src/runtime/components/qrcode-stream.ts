import type { BarcodeFormat, QrcodeStreamProps } from 'vue-qrcode-reader'
import { QrcodeStream } from 'vue-qrcode-reader'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export type { QrcodeStreamProps }

export default defineComponent<QrcodeStreamProps>({
  name: 'QrcodeStream',
  inheritAttrs: false,
  setup(props, { attrs, slots }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
      .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[]
    // TODO: check upstream if above filter is still needed

    return () => h(QrcodeStream, {
      ...attrs,
      formats,
    }, slots)
  },
})
