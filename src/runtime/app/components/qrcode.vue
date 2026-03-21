<script lang="ts">
import type { QrCodeGenerateResult } from 'uqr'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { encode } from 'uqr'

import { computed, toRef, h, useAttrs, useRuntimeConfig } from '#imports'
import { renderSVGBody } from '#qrcode/utils/qrcode/svg/render'
import { getSize } from '#qrcode/utils/qrcode/svg/utils'
import type { RenderSVGOptions } from '../../types'

export interface QrcodeProps extends Omit<RenderSVGOptions, 'onEncoded'> {
  value: string | number[]
  width?: number | string
  height?: number | string
  preserveAspectRatio?: string
}

export interface QrcodeEmits {
  encoded: [qr: QrCodeGenerateResult]
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<QrcodeProps>()
const emits = defineEmits<QrcodeEmits>()
const attrs = useAttrs()

const _options = reactivePick(props, (_, key) => key !== 'value')
const options = computed(() => {
  return defu<Omit<QrcodeProps, 'value'>, RenderSVGOptions[]>(
    _options,
    useRuntimeConfig().public.qrcode.options as RenderSVGOptions,
  )
})

const SVG = computed(() => {
  const {
    radius,
    pixelSize,
    pixelPadding,
    variant,
    width,
    height,
    preserveAspectRatio,
    whiteColor,
    blackColor,
    invert,
    ...opts
  } = options.value

  const result = encode(toRef(() => props.value).value, {
    ...opts,
    onEncoded: qr => emits('encoded', qr),
  })
  const s = getSize(result.size, pixelSize)

  return h('svg', {
    ...attrs,
    xmlns: 'http://www.w3.org/2000/svg',
    width,
    height,
    preserveAspectRatio,
    viewBox: `0 0 ${s.width} ${s.height}`,
    innerHTML: renderSVGBody(result, {
      radius,
      pixelSize,
      pixelPadding,
      variant,
      border: opts.border,
      whiteColor,
      blackColor,
      invert,
    }),
  })
})
</script>

<template>
  <component :is="SVG" />
</template>
