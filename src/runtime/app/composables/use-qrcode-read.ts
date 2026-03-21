import { useDevicesList } from '@vueuse/core'
import { defu } from 'defu'
import type { DetectedBarcode, BarcodeFormat, BarcodeFormats } from '../../types'
import {
  computed,
  reactive,
  ref,
  watch,
  onNuxtReady,
  onBeforeUnmount,
  useRuntimeConfig,
} from '#imports'

const BARCODE_FORMATS = ['aztec', 'code_128', 'code_39', 'code_93', 'codabar', 'databar', 'databar_expanded', 'data_matrix', 'dx_film_edge', 'ean_13', 'ean_8', 'itf', 'maxi_code', 'micro_qr_code', 'pdf417', 'qr_code', 'rm_qr_code', 'upc_a', 'upc_e', 'linear_codes', 'matrix_codes', 'unknown'] as const

export function useQrcodeRead(
  {
    formats,
  }: {
    formats?: Partial<BarcodeFormats>
  } = {},
) {
  const defFormats = useRuntimeConfig().public.qrcode.reader.formats as BarcodeFormat[]
  const defaultFormats = defFormats.reduce((result, option) => {
    if (option in result) {
      result[option] = true
    }
    else {
      console.warn(`Unknown barcode format: ${option}`)
      result.unknown = true
    }
    return result
  }, Object.fromEntries(BARCODE_FORMATS.map(format => [format, false])) as BarcodeFormats)

  const constraints = ref({ facingMode: 'environment' })
  const constraintOptions = [
    { label: 'rear camera', value: { facingMode: 'environment' } },
    { label: 'front camera', value: { facingMode: 'user' } },
  ]

  /** * detection handling */

  const { videoInputs: cameras } = useDevicesList({ constraints: { audio: false, video: true } })
  const selectedCamera = ref<MediaDeviceInfo | undefined>(undefined)

  const availableFormats = reactive<BarcodeFormats>(defu<BarcodeFormats, BarcodeFormats[]>(formats, defaultFormats))
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

  /** * track functions */

  const trackOptions = [
    { label: 'nothing (default)', value: undefined },
    { label: 'outline', value: paintOutline },
    { label: 'centered text', value: paintCenterText },
    { label: 'bounding box', value: paintBoundingBox },
  ]
  const track = ref(trackOptions[1]!.value)

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
