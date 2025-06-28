<script lang="ts">
import type { BarcodeFormat, QrcodeStreamProps, DetectedBarcode, EmittedError } from 'vue-qrcode-reader'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useRuntimeConfig } from '#imports'

export type { QrcodeStreamProps }

export interface QrcodeStreamEmits {
  /**
   * Defines callback function called when code detetect.
   */
  (e: 'detect', detectedCodes: DetectedBarcode[]): void
  /**
   * Defines callback function called when camera becomes on.
   */
  (e: 'camera-on', capabilities: Partial<MediaTrackCapabilities>): void
  /**
   * Defines callback function called when camera becomes off.
   */
  (e: 'camera-off'): void
  /**
   * Defines callback function called when error occures.
   */
  (e: 'error', error: EmittedError): void
}

export interface QrcodeStreamSlots {
  default?: (props: {}) => any
}
</script>

<script setup lang="ts">
const props = defineProps<QrcodeStreamProps>()

const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
  .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[] // TODO: check upstream if above filter is still needed

defineEmits<QrcodeStreamEmits>()
defineSlots<QrcodeStreamSlots>()
</script>

<template>
  <QrcodeStream v-bind="$attrs" :formats>
    <slot />
  </QrcodeStream>
</template>
