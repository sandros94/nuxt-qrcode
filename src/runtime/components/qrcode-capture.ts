import { type BarcodeFormat, QrcodeCapture } from 'vue-qrcode-reader'
import type { ExtractPropTypes, PropType } from '#imports'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export default defineComponent<ExtractPropTypes<typeof QrcodeCapture.props>>({
  name: 'QrcodeCapture',
  inheritAttrs: false,
  props: {
    formats: {
      type: Array as PropType<BarcodeFormat[]> | undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const { formats } = useRuntimeConfig().public.qrcode

    return () => h(QrcodeCapture, {
      ...attrs,
      formats: props.formats || formats,
    }, slots)
  },
})
