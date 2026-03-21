/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type { QrCodeGenerateData } from 'uqr'
import { defu } from 'defu'

import type { RenderSVGOptions } from '#qrcode/utils/qrcode/svg/render'
import { renderSVG, renderSVGBase64 } from '#qrcode/utils/qrcode/svg/render'

import type { MaybeRefOrGetter, Ref } from '#imports'
import { reactive, toRef, computed, useRuntimeConfig } from '#imports'

type ComputedOptions<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Function ? T[K] : ComputedOptions<T[K]> | Ref<T[K]> | T[K]
}

export function useQrcode(
  data: MaybeRefOrGetter<QrCodeGenerateData>,
  options: ComputedOptions<RenderSVGOptions> & {
    toBase64?: boolean
  } = {},
) {
  const {
    variant,
    radius,
    pixelPadding,
    blackColor,
    whiteColor,
    boostEcc,
    border,
    ecc,
    invert,
    maskPattern,
    maxVersion,
    minVersion,
    onEncoded,
    pixelSize,
    toBase64 = false,
  } = options
  const src = toRef(data)

  const _options = reactive({
    variant,
    radius,
    pixelPadding,
    blackColor,
    whiteColor,
    boostEcc,
    border,
    ecc,
    invert,
    maskPattern,
    maxVersion,
    minVersion,
    onEncoded,
    pixelSize,
  })

  const opts = computed(() => defu(
    _options,
    useRuntimeConfig().public.qrcode.options,
  ) as RenderSVGOptions)

  return computed(() => {
    if (toBase64) {
      return renderSVGBase64(src.value, opts.value)
    }
    else {
      return renderSVG(src.value, opts.value)
    }
  })
}
