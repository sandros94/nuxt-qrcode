import type { QrCodeGenerateData } from 'uqr'
import { defu } from 'defu'

import type { RenderSVGOptions } from '#qrcode/utils/qrcode/svg/render'
import { renderSVG } from '#qrcode/utils/qrcode/svg/render'

import type { MaybeRefOrGetter } from '#imports'
import { toRef, useRuntimeConfig } from '#imports'

export function useQrcode(
  data: MaybeRefOrGetter<QrCodeGenerateData>,
  options?: RenderSVGOptions,
) {
  const _options = defu(
    options,
    useRuntimeConfig().public.qrcode.options as RenderSVGOptions,
  )

  const src = toRef(data)

  return renderSVG(src.value, _options)
}
