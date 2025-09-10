import type { ComponentObjectPropsOptions, ComponentOptionsMixin, SlotsType } from 'vue'
import type { QrcodeDropZoneProps, EmittedError } from 'vue-qrcode-reader'
import { QrcodeDropZone } from 'vue-qrcode-reader'

import { defineComponent, h, useRuntimeConfig } from '#imports'
import type { BarcodeFormat, DetectedBarcode } from '../types'

export type { QrcodeDropZoneProps }

export interface QrcodeDropZoneEmits {
  (e: 'detect', detectedCodes: DetectedBarcode[]): void
  (e: 'dragover', isDraggingOver: boolean): void
  (e: 'error', error: EmittedError): void
}

export interface QrcodeDropZoneSlots extends SlotsType {
  default?: (props: {}) => any
}

export default defineComponent<QrcodeDropZoneProps, ComponentObjectPropsOptions, string, QrcodeDropZoneEmits, {}, string, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, QrcodeDropZoneSlots>({
  name: 'QrcodeDropZone',
  emits: ['detect', 'dragover', 'error'],
  setup(props, { attrs, slots }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats) as BarcodeFormat[]

    return () => h(QrcodeDropZone, {
      ...props,
      ...attrs,
      formats,
    }, slots)
  },
})
