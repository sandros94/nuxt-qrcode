import { type BarcodeFormat, QrcodeCapture } from 'vue-qrcode-reader'
import type { PropType } from '#imports'
import { defineComponent, h, useRuntimeConfig } from '#imports'

export type QrcodeCaptureProps = Parameters<Exclude<typeof QrcodeCapture.setup, undefined>>['0']

export default defineComponent<QrcodeCaptureProps>({
  name: 'QrcodeCapture',
  inheritAttrs: false,
  props: {
    formats: {
      type: Array as PropType<BarcodeFormat[]> | undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const { formats } = useRuntimeConfig().public.qrcode.reader

    return () => h(QrcodeCapture, {
      ...attrs,
      formats: props.formats || formats,
    }, slots)
  },
})
