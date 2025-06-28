import type { BarcodeFormat, QrcodeDropZoneProps } from 'vue-qrcode-reader'
import { QrcodeDropZone } from 'vue-qrcode-reader'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export type { QrcodeDropZoneProps }

export default defineComponent<QrcodeDropZoneProps>({
  name: 'QrcodeDropZone',
  inheritAttrs: false,
  setup(props, { attrs, slots }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
      .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[]
    // TODO: check upstream if above filter is still needed

    return () => h(QrcodeDropZone, {
      ...attrs,
      formats,
    }, slots)
  },
})
