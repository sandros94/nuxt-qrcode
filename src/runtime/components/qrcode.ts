import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import type { QrCodeGenerateData } from 'uqr'
import type { RenderSVGOptions } from 'nuxt-qrcode'
import { type PropType, ref, defineComponent, h, watchEffect, useRuntimeConfig } from '#imports'
import { renderSVG } from '#qrcode/utils/qrcode/svg/render'

export default defineComponent({
  name: 'Qrcode',
  props: {
    value: {
      type: String as PropType<QrCodeGenerateData>,
      required: true,
    },
    variant: {
      type: String as PropType<RenderSVGOptions['variant']>,
    },
    radius: {
      type: Number as PropType<RenderSVGOptions['radius']>,
    },
    pixelPadding: {
      type: Number as PropType<RenderSVGOptions['pixelPadding']>,
    },
    blackColor: {
      type: String as PropType<RenderSVGOptions['blackColor']>,
    },
    whiteColor: {
      type: String as PropType<RenderSVGOptions['whiteColor']>,
    },
    boostEcc: {
      type: Boolean as PropType<RenderSVGOptions['boostEcc']>,
    },
    border: {
      type: Number as PropType<RenderSVGOptions['border']>,
    },
    ecc: {
      type: String as PropType<RenderSVGOptions['ecc']>,
    },
    invert: {
      type: Boolean as PropType<RenderSVGOptions['invert']>,
    },
    maskPattern: {
      type: Number as PropType<RenderSVGOptions['maskPattern']>,
    },
    maxVersion: {
      type: Number as PropType<RenderSVGOptions['maxVersion']>,
    },
    minVersion: {
      type: Number as PropType<RenderSVGOptions['minVersion']>,
    },
    onEncoded: {
      type: Function as PropType<RenderSVGOptions['onEncoded']>,
    },
    pixelSize: {
      type: Number as PropType<RenderSVGOptions['pixelSize']>,
    },
  },
  setup(props) {
    const qr = ref<string>()
    const options = reactivePick(props, (_, key) => key !== 'value')

    watchEffect(() => {
      qr.value = renderSVG(props.value,
        defu(
          options,
          useRuntimeConfig().public.qrcode.options,
        ) as RenderSVGOptions,
      )
    })

    return () => h('div', { innerHTML: qr.value })
  },
})
