<script lang="ts">
import type { BarcodeFormat, QrcodeCaptureProps, DetectedBarcode } from 'vue-qrcode-reader'
import { QrcodeCapture } from 'vue-qrcode-reader'
import { useRuntimeConfig } from '#imports'

export type { QrcodeCaptureProps }

export interface QrcodeCaptureEmits {
  (e: 'detect', detectedCodes: DetectedBarcode[]): void
}
</script>

<script setup lang="ts">
const props = defineProps<QrcodeCaptureProps>()

const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
  .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[] // TODO: check upstream if above filter is still needed

defineEmits<QrcodeCaptureEmits>()
</script>

<template>
  <QrcodeCapture v-bind="$attrs" :formats />
</template>
