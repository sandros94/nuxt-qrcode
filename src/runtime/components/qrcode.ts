import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { type QrCodeGenerateData, encode } from 'uqr'
import type { QrcodeProps, RenderSVGOptions } from 'nuxt-qrcode'
import { type PropType, type VNode, ref, computed, defineComponent, h, watchEffect, useRuntimeConfig } from '#imports'
import { renderSVGBody } from '#qrcode/utils/qrcode/svg/render'
import { getSize } from '#qrcode/utils/qrcode/svg/utils'

export default defineComponent<QrcodeProps>({
  name: 'Qrcode',
  props: {
    value: {
      type: String as PropType<QrCodeGenerateData>,
      required: true,
    },
    variant: {
      type: [String, Object] as PropType<RenderSVGOptions['variant']>,
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
  setup(props, { attrs }) {
    const qr = ref<VNode>()
    const _options = reactivePick(props, (_, key) => key !== 'value')
    const options = computed(() => {
      return defu<QrcodeProps, RenderSVGOptions[]>(
        _options,
        useRuntimeConfig().public.qrcode.options as RenderSVGOptions,
      )
    })

    watchEffect(() => {
      const {
        value,
        radius,
        pixelSize,
        pixelPadding,
        variant,

        // SVGAttrs
        width,
        height,
        preserveAspectRatio,

        // render body
        whiteColor,
        blackColor,
        invert,

        // encode options
        ...opts
      } = options.value

      const result = encode(props.value, opts)
      const s = getSize(result.size, pixelSize)

      qr.value = h('svg', {
        ...attrs,
        width,
        height,
        preserveAspectRatio,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `0 0 ${s.width} ${s.height}`,
        innerHTML: renderSVGBody(
          result,
          {
            radius,
            pixelSize,
            pixelPadding,
            variant,
            border: opts.border,
            whiteColor,
            blackColor,
            invert,
          },
        ),
      })
    })

    return () => qr.value
  },
})
