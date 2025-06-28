<script lang="ts">
import type { BarcodeFormat, QrcodeDropZoneProps, DetectedBarcode, EmittedError } from 'vue-qrcode-reader'
import { QrcodeDropZone } from 'vue-qrcode-reader'
import { useRuntimeConfig } from '#imports'

export type { QrcodeDropZoneProps }

export interface QrcodeDropZoneEmits {
  (e: 'detect', detectedCodes: DetectedBarcode[]): void
  (e: 'dragover', isDraggingOver: boolean): void
  (e: 'error', error: EmittedError): void
}

export interface QrcodeDropZoneSlots {
  default?: (props: {}) => any
}
</script>

<script setup lang="ts">
const props = defineProps<QrcodeDropZoneProps>()

const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
  .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[] // TODO: check upstream if above filter is still needed

defineEmits<QrcodeDropZoneEmits>()
defineSlots<QrcodeDropZoneSlots>()
</script>

<template>
  <QrcodeDropZone v-bind="$attrs" :formats>
    <slot />
  </QrcodeDropZone>
</template>
