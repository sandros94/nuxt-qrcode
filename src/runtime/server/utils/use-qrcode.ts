import type { QrCodeGenerateData } from 'uqr'
import { defu } from 'defu'

import type { RenderSVGOptions } from '#qrcode/utils/qrcode/svg/render'
import { renderSVG, renderSVGBase64 } from '#qrcode/utils/qrcode/svg/render'

import { useRuntimeConfig } from '#imports'

export function useQrcode(
  data: QrCodeGenerateData,
  options: RenderSVGOptions & {
    toBase64?: boolean
  } = {},
) {
  const { toBase64, ...opts } = options
  const _options = defu(
    opts,
    (useRuntimeConfig().public.qrcode as any).options,
  ) as RenderSVGOptions

  if (toBase64) {
    return renderSVGBase64(data, {
      ..._options,
      blackColor: opts.blackColor || '#000000',
      whiteColor: opts.whiteColor || '#ffffff',
    })
  }
  else {
    return renderSVG(data, _options)
  }
}
