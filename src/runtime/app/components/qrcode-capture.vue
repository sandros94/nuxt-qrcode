<script lang="ts">
import type {
  QrcodeCaptureProps as _QrcodeCaptureProps,
} from 'vue-qrcode-reader'
import type { BarcodeFormat, DetectedBarcode } from '../../types'
import { QrcodeCapture } from 'vue-qrcode-reader'
import { computed, useRuntimeConfig } from '#imports'

export interface QrcodeCaptureProps extends Omit<_QrcodeCaptureProps, 'formats'> {
  formats?: BarcodeFormat[]
}

export interface QrcodeCaptureEmits {
  (e: 'detect', detectedCodes: DetectedBarcode[]): void
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<QrcodeCaptureProps>()
const emit = defineEmits<QrcodeCaptureEmits>()

const resolvedFormats = computed(() =>
  (props.formats || useRuntimeConfig().public.qrcode.reader.formats) as any,
)
</script>

<template>
  <QrcodeCapture
    v-bind="{ ...$props, ...$attrs }"
    :formats="resolvedFormats"
    @detect="(codes: DetectedBarcode[]) => emit('detect', codes)"
  />
</template>
