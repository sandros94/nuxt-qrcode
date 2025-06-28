<script lang="ts">
import { defu } from 'defu'
import { encode } from 'uqr'
import { reactivePick } from '@vueuse/core'
import type { RenderSVGOptions } from '../types'
import { type VNode, ref, computed, h, watchEffect, useAttrs, useRuntimeConfig } from '#imports'
import { renderSVGBody } from '#qrcode/utils/qrcode/svg/render'
import { getSize } from '#qrcode/utils/qrcode/svg/utils'

export interface QrcodeProps extends RenderSVGOptions {
  value: string | number[]
  width?: number | string
  height?: number | string
  preserveAspectRatio?: string
}
</script>

<script setup lang="ts">
const props = defineProps<QrcodeProps>()
const attrs = useAttrs()

const qr = ref<VNode>()
const _options = reactivePick(props, (_, key) => key !== 'value')
const options = computed(() => {
  return defu<QrcodeProps, [RenderSVGOptions]>(
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
</script>

<template>
  <qr />
</template>
