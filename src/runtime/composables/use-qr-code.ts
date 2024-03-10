import type { DetectedBarcode, BarcodeFormat, BarcodeFormats } from '../types'
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { useDevicesList } from '@vueuse/core'
import { defu } from 'defu'
import { useRuntimeConfig } from '#app'

export function useQrCodeRead(
  {
    barcodeFormats
  }: {
    barcodeFormats?: Partial<BarcodeFormats>
  } = {}
) {
  const { barcodeFormats: defaultFormats } = useRuntimeConfig().public.nuxtQrcode

  /*** detection handling ***/

  const result = ref<string[]>([])
  function onDetect(detectedCodes: DetectedBarcode[]) {
    result.value = detectedCodes.map((code) => code.rawValue)
  }

  const { videoInputs: cameras } = useDevicesList({ constraints: { audio: false, video: true }})
  const selectedCamera = ref<MediaDeviceInfo | null>(null)

  const _barcodeFormats = reactive<BarcodeFormats>(defu(barcodeFormats, defaultFormats))
  const selectedFormats = computed<BarcodeFormat[]>(() => {
    return Object.keys(_barcodeFormats).filter((format) => _barcodeFormats[format as BarcodeFormat]) as BarcodeFormat[]
  })

  onMounted(() => {
    watch(cameras, (newCameras) => {
      if (newCameras.length > 0 && !selectedCamera.value) {
        selectedCamera.value = newCameras[0]
      }
    })
  })

  /*** track functons ***/

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
        boundingBox: { x, y, width, height }
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
  const trackFunctionOptions = [
    { text: 'nothing (default)', value: undefined },
    { text: 'outline', value: paintOutline },
    { text: 'centered text', value: paintCenterText },
    { text: 'bounding box', value: paintBoundingBox }
  ]
  const trackFunctionSelected = ref(trackFunctionOptions[1])
  
  /*** error handling ***/

  const error = ref('')

  function onError(err: any) {
    error.value = `[${err.name}]: `

    if (err.name === 'NotAllowedError') {
      error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
      error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
      error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
      error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
      error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
      error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
      error.value +=
        'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
      error.value += err.message
    }
  }

  return {
    barcodeFormats: _barcodeFormats,
    cameras,
    error,
    onDetect,
    onError,
    result,
    selectedCamera,
    selectedFormats,
    trackFunctionOptions,
    trackFunctionSelected
  }
}
