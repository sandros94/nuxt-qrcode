<script lang="ts">
import type {
  QrcodeStreamProps as _QrcodeStreamProps,
  EmittedError,
} from 'vue-qrcode-reader'
import { QrcodeStream } from 'vue-qrcode-reader'
import type { VNode } from 'vue'

import { computed, useRuntimeConfig } from '#imports'
import type { BarcodeFormat, DetectedBarcode } from '../../types'

export interface QrcodeStreamProps extends Omit<_QrcodeStreamProps, 'formats'> {
  formats?: BarcodeFormat[]
}

export interface QrcodeStreamSlots {
  default?: (props: {}) => VNode[]
}

export interface QrcodeStreamEmits {
  'detect': [detectedCodes: DetectedBarcode[]]
  'camera-on': [capabilities: Partial<MediaTrackCapabilities>]
  'camera-off': []
  'error': [error: EmittedError]
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<QrcodeStreamProps>()
const emits = defineEmits<QrcodeStreamEmits>()
defineSlots<QrcodeStreamSlots>()

const resolvedFormats = computed(() =>
  (props.formats || useRuntimeConfig().public.qrcode.reader.formats) as any,
)
</script>

<template>
  <QrcodeStream
    v-bind="{ ...$attrs, ...$props }"
    :formats="resolvedFormats"
    @detect="br => emits('detect', br)"
    @camera-on="cap => emits('camera-on', cap)"
    @camera-off="() => emits('camera-off')"
    @error="err => emits('error', err)"
  >
    <template #default="sProps">
      <slot v-bind="sProps" />
    </template>
  </QrcodeStream>
</template>
