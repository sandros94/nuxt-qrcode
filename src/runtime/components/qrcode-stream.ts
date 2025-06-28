import { type BarcodeFormat, QrcodeStream } from 'vue-qrcode-reader'
import type { PropType } from '#imports'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export type QrcodeStreamProps = Parameters<Exclude<typeof QrcodeStream.setup, undefined>>['0']

export default defineComponent<QrcodeStreamProps>({
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
