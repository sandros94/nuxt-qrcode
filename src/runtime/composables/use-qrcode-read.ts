import { useDevicesList } from '@vueuse/core'
import { defu } from 'defu'
import type { DetectedBarcode, BarcodeFormat, BarcodeFormats } from '../types'
import {
  computed,
  reactive,
  ref,
  watch,
  onNuxtReady,
  onBeforeUnmount,
  useRuntimeConfig,
} from '#imports'

export function useQrcodeRead(
  {
    formats,
  }: {
    formats?: Partial<BarcodeFormats>
  } = {},
) {
  const defFormats = useRuntimeConfig().public.qrcode.formats as BarcodeFormat[]
  const defaultFormats = defFormats.reduce((result, option) => {
    result[option] = true
    return result
  }, {
    aztec: false,
    code_128: false,
    code_39: false,
    code_93: false,
    codabar: false,
    databar: false,
    databar_expanded: false,
    data_matrix: false,
    dx_film_edge: false,
    ean_13: false,
    ean_8: false,
    itf: false,
    maxi_code: false,
    micro_qr_code: false,
    pdf417: false,
    qr_code: false,
    rm_qr_code: false,
    upc_a: false,
    upc_e: false,
    linear_codes: false,
    matrix_codes: false,
    unknown: false,
  })

  const constraints = ref({ facingMode: 'environment' })
  const constraintOptions = [
    { label: 'rear camera', value: { facingMode: 'environment' } },
    { label: 'front camera', value: { facingMode: 'user' } },
  ]

  /** * detection handling */

  const { videoInputs: cameras } = useDevicesList({ constraints: { audio: false, video: true } })
  const selectedCamera = ref<MediaDeviceInfo | null>(null)

  const availableFormats = reactive<BarcodeFormats>(defu(formats, defaultFormats))
  const _formats = computed<BarcodeFormat[]>(() => {
    return Object.keys(availableFormats).filter(format => availableFormats[format as BarcodeFormat]) as BarcodeFormat[]
  })

  onNuxtReady(() => {
    const stop = watch(cameras, (newCameras) => {
      if (newCameras.length > 0 && !selectedCamera.value) {
        selectedCamera.value = newCameras[0]
      }
    })

    onBeforeUnmount(() => stop())
  })

  /** * track functons */

  const trackOptions = [
    { label: 'nothing (default)', value: undefined },
    { label: 'outline', value: paintOutline },
    { label: 'centered text', value: paintCenterText },
    { label: 'bounding box', value: paintBoundingBox },
  ]
  const track = ref(trackOptions[1].value)

  function paintOutline(detectedCodes: DetectedBarcode[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
      const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

      ctx.strokeStyle = 'red'

      ctx.beginPath()
      ctx.moveTo(firstPoint.x, firstPoint.y)
      for (const { x, y } of otherPoints) {
        ctx.lineTo(x, y)
      }
      ctx.lineTo(firstPoint.x, firstPoint.y)
      ctx.closePath()
      ctx.stroke()
    }
  }
  function paintBoundingBox(detectedCodes: DetectedBarcode[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height },
      } = detectedCode

      ctx.lineWidth = 2
      ctx.strokeStyle = '#007bff'
      ctx.strokeRect(x, y, width, height)
    }
  }
  function paintCenterText(detectedCodes: DetectedBarcode[], ctx: CanvasRenderingContext2D) {
    for (const detectedCode of detectedCodes) {
      const { boundingBox, rawValue } = detectedCode

      const centerX = boundingBox.x + boundingBox.width / 2
      const centerY = boundingBox.y + boundingBox.height / 2

      const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = 'center'

      ctx.lineWidth = 3
      ctx.strokeStyle = '#35495e'
      ctx.strokeText(detectedCode.rawValue, centerX, centerY)

      ctx.fillStyle = '#5cb984'
      ctx.fillText(rawValue, centerX, centerY)
    }
  }

  return {
    availableFormats,
    cameras,
    selectedCamera,
    formats: _formats,
    constraintOptions,
    constraints,
    trackOptions,
    track,
  }
}
