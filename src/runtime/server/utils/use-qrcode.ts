import type { QrCodeGenerateData } from 'uqr'
import { defu } from 'defu'

import type { RenderSVGOptions } from '#qrcode/utils/qrcode/svg/render'
import { renderSVG } from '#qrcode/utils/qrcode/svg/render'

import { useRuntimeConfig } from '#imports'

export function useQrcode(
  data: QrCodeGenerateData,
  options?: RenderSVGOptions,
) {
  const _options = defu(
    options,
    useRuntimeConfig().public.qrcode.options,
  ) as RenderSVGOptions

  return renderSVG(data, _options)
}
