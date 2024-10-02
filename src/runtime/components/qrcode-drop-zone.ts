import { type BarcodeFormat, QrcodeDropZone } from 'vue-qrcode-reader'
import type { ExtractPropTypes, PropType } from '#imports'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export default defineComponent<ExtractPropTypes<typeof QrcodeDropZone.props>>({
  name: 'QrcodeDropZone',
  inheritAttrs: false,
  props: {
    formats: {
      type: Array as PropType<BarcodeFormat[]> | undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const { formats } = useRuntimeConfig().public.qrcode

    return () => h(QrcodeDropZone, {
      ...attrs,
      formats: props.formats || formats,
    }, slots)
  },
})
