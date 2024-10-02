import type { QrCodeGenerateData, QrCodeGenerateOptions, QrCodeGenerateResult } from 'uqr'
import { encode } from 'uqr'
import { defu } from 'defu'

import type { MaybeRefOrGetter } from '#imports'
import { onBeforeUnmount, ref, toRef, watchEffect, useRuntimeConfig } from '#imports'

export function useQrcode(
  text: MaybeRefOrGetter<QrCodeGenerateData>,
  options?: QrCodeGenerateOptions,
) {
  const defOptions = useRuntimeConfig().public.qrcode.options as QrCodeGenerateOptions
  const _options = defu(options, defOptions)

  const src = toRef(text)
  const init = encode(src.value, _options)
  const data = ref<QrCodeGenerateResult['data']>(init.data)
  const maskPattern = ref<QrCodeGenerateResult['maskPattern']>(init.maskPattern)
  const size = ref<QrCodeGenerateResult['size']>(init.size)
  const types = ref<QrCodeGenerateResult['types']>(init.types)
  const version = ref<QrCodeGenerateResult['version']>(init.version)

  const stop = watchEffect(
    () => {
      const {
        data: d,
        maskPattern: m,
        size: s,
        types: t,
        version: v,
      } = encode(src.value, _options)
      data.value = d
      maskPattern.value = m
      size.value = s
      types.value = t
      version.value = v
    },
  )

  onBeforeUnmount(() => stop())

  return {
    data,
    maskPattern,
    size,
    types,
    version,
  }
}
