import type { QrCodeGenerateData, QrCodeGenerateOptions, QrCodeGenerateResult } from 'uqr'
import { encode } from 'uqr'
import { ref } from 'vue'

export function useQrcodeGenerate(outCanvas?: HTMLCanvasElement) {

  function encoded(data: QrCodeGenerateData, options?: QrCodeGenerateOptions): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.imageRendering = 'pixelated'
    canvas.style.imageRendering = 'crisp-edges'
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.clearRect(0, 0, width, height)
    ctx.imageSmoothingEnabled = false

    const qr = encode(data, options)

    return canvas
  }

  return {
    encode,
    encoded
  }
}
