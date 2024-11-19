import type { QrCodeGenerateData } from 'uqr'
import { defu } from 'defu'

import type { RenderSVGOptions } from '#qrcode/utils/qrcode/svg/render'
import { renderSVG } from '#qrcode/utils/qrcode/svg/render'

import type { MaybeRefOrGetter, Ref } from '#imports'
import { ref, reactive, toRef, watchEffect, useRuntimeConfig } from '#imports'

type ComputedOptions<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Function ? T[K] : ComputedOptions<T[K]> | Ref<T[K]> | T[K]
}

export function useQrcode(
  data: MaybeRefOrGetter<QrCodeGenerateData>,
  options?: ComputedOptions<RenderSVGOptions>,
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
  } = options || {}
  const src = toRef(data)
  const qrcode = ref<string>()

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

  watchEffect(() => {
    qrcode.value = renderSVG(src.value,
      defu(
        _options,
        useRuntimeConfig().public.qrcode.options,
      ) as RenderSVGOptions,
    )
  })

  return qrcode
}
