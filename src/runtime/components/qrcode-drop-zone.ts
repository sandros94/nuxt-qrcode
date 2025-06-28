import { type BarcodeFormat, QrcodeDropZone } from 'vue-qrcode-reader'
import type { PropType } from '#imports'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export type QrcodeDropZoneProps = Parameters<Exclude<typeof QrcodeDropZone.setup, undefined>>['0']

export default defineComponent<QrcodeDropZoneProps>({
  name: 'QrcodeDropZone',
  inheritAttrs: false,
  props: {
    formats: {
      type: Array as PropType<BarcodeFormat[]> | undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const { formats } = useRuntimeConfig().public.qrcode.reader

    return () => h(QrcodeDropZone, {
      ...attrs,
      formats: props.formats || formats,
    }, slots)
  },
})
