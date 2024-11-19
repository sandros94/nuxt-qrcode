import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { type QrCodeGenerateData, encode } from 'uqr'
import type { RenderSVGOptions } from 'nuxt-qrcode'
import { type PropType, type VNode, ref, computed, toRefs, defineComponent, h, watchEffect, useRuntimeConfig } from '#imports'
import { renderSVGBody } from '#qrcode/utils/qrcode/svg/render'
import { getSize } from '#qrcode/utils/qrcode/svg/utils'

export default defineComponent({
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
  setup(props) {
    const qr = ref<VNode>()
    const _options = reactivePick(props, (_, key) => key !== 'value')
    const options = computed(() => {
      return defu(
        _options,
        useRuntimeConfig().public.qrcode.options,
      ) as RenderSVGOptions
    })

    watchEffect(() => {
      const {
        radius,
        pixelSize,
        pixelPadding,
        variant,
        ...opts
      } = options.value
    
      const result = encode(props.value, opts)
      const { width, height } = getSize(result.size, pixelSize)

      qr.value = h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `0 0 ${width} ${height}`,
        preserveAspectRatio: 'xMidYMid meet',
        width:'100%',
        height: '100%',
        innerHTML: renderSVGBody(result, { radius, pixelSize, pixelPadding, variant, border: opts.border })
      })
    })

    return () => qr.value
  },
})
