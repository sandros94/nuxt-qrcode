<script lang="ts">
import type {
  QrcodeDropZoneProps as _QrcodeDropZoneProps,
  EmittedError,
} from 'vue-qrcode-reader'
import { QrcodeDropZone } from 'vue-qrcode-reader'

import { computed, useRuntimeConfig, type VNode } from '#imports'
import type { BarcodeFormat, DetectedBarcode } from '../../types'

export interface QrcodeDropZoneProps extends Omit<_QrcodeDropZoneProps, 'formats'> {
  formats?: BarcodeFormat[]
}

export interface QrcodeDropZoneSlots {
  default?: (props: {}) => VNode[]
}

export interface QrcodeDropZoneEmits {
  detect: [detectedCodes: DetectedBarcode[]]
  dragover: [isDraggingOver: boolean]
  error: [error: EmittedError]
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<QrcodeDropZoneProps>()
const emit = defineEmits<QrcodeDropZoneEmits>()
defineSlots<QrcodeDropZoneSlots>()

const resolvedFormats = computed(() =>
  (props.formats || useRuntimeConfig().public.qrcode.reader.formats) as any,
)
</script>

<template>
  <QrcodeDropZone
    v-bind="{ ...$props, ...$attrs }"
    :formats="resolvedFormats"
    @detect="(codes: DetectedBarcode[]) => emit('detect', codes)"
    @dragover="(isDraggingOver: boolean) => emit('dragover', isDraggingOver)"
    @error="(error: EmittedError) => emit('error', error)"
  >
    <template #default="sProps">
      <slot v-bind="sProps" />
    </template>
  </QrcodeDropZone>
</template>
