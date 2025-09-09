import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import type { ComponentObjectPropsOptions } from 'vue'
import { type QrCodeGenerateResult, encode } from 'uqr'
import type { RenderSVGOptions } from '../types'
import { type PropType, type VNode, computed, toRef, defineComponent, h, useRuntimeConfig } from '#imports'
import { renderSVGBody } from '#qrcode/utils/qrcode/svg/render'
import { getSize } from '#qrcode/utils/qrcode/svg/utils'

export interface QrcodeProps extends Omit<RenderSVGOptions, 'onEncoded'> {
  value: string | number[]
  width?: number | string
  height?: number | string
  preserveAspectRatio?: string
}

export interface QrcodeEmits {
  (e: 'encoded', qr: QrCodeGenerateResult): void
}

export default defineComponent<QrcodeProps, ComponentObjectPropsOptions, string, QrcodeEmits>({
  name: 'Qrcode',
  props: {
    value: {
      type: [String, Array] as PropType<QrcodeProps['value']>,
      required: true,
    },
    width: {
      type: [Number, String] as PropType<QrcodeProps['width']>,
    },
    height: {
      type: [Number, String] as PropType<QrcodeProps['height']>,
    },
    variant: {
      type: [String, Object] as PropType<QrcodeProps['variant']>,
    },
    radius: {
      type: [Number, Object] as PropType<QrcodeProps['radius']>,
    },
    pixelPadding: {
      type: Number as PropType<QrcodeProps['pixelPadding']>,
    },
    preserveAspectRatio: {
      type: String as PropType<QrcodeProps['preserveAspectRatio']>,
    },
    blackColor: {
      type: String as PropType<QrcodeProps['blackColor']>,
    },
    whiteColor: {
      type: String as PropType<QrcodeProps['whiteColor']>,
    },
    boostEcc: {
      type: Boolean as PropType<QrcodeProps['boostEcc']>,
    },
    border: {
      type: Number as PropType<QrcodeProps['border']>,
    },
    ecc: {
      type: String as PropType<QrcodeProps['ecc']>,
    },
    invert: {
      type: Boolean as PropType<QrcodeProps['invert']>,
    },
    maskPattern: {
      type: Number as PropType<QrcodeProps['maskPattern']>,
    },
    maxVersion: {
      type: Number as PropType<QrcodeProps['maxVersion']>,
    },
    minVersion: {
      type: Number as PropType<QrcodeProps['minVersion']>,
    },
    pixelSize: {
      type: Number as PropType<QrcodeProps['pixelSize']>,
    },
  },
  emits: ['encoded'],
  setup(props, { attrs, emit }) {
    const _options = reactivePick(props, (_, key) => key !== 'value')
    const valueRef = toRef(props, 'value')
    const options = computed(() => {
      return defu<Omit<QrcodeProps, 'value'>, RenderSVGOptions[]>(
        _options,
        useRuntimeConfig().public.qrcode.options as RenderSVGOptions,
      )
    })

    const qr = computed<VNode>(() => {
      const {
        // @ts-expect-error value is not in options, but destructuring it for safety
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

      const result = encode(valueRef.value, {
        ...opts,
        onEncoded: (qr: QrCodeGenerateResult) => {
          // Emit the encoded QR code result
          emit('encoded', qr)
        },
      })
      const s = getSize(result.size, pixelSize)

      return h('svg', {
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
