import { type BarcodeFormat, QrcodeStream } from 'vue-qrcode-reader'
import type { ExtractPropTypes, PropType } from '#imports'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export default defineComponent<ExtractPropTypes<typeof QrcodeStream.props>>({
  name: 'QrcodeStream',
  inheritAttrs: false,
  props: {
    formats: {
      type: Array as PropType<BarcodeFormat[]> | undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const { formats } = useRuntimeConfig().public.qrcode.reader

    return () => h(QrcodeStream, {
      ...attrs,
      formats: props.formats || formats,
    }, slots)
  },
})
