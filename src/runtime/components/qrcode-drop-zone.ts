import type { ComponentObjectPropsOptions, ComponentOptionsMixin, SlotsType } from 'vue'
import type { BarcodeFormat, QrcodeDropZoneProps, EmittedError } from 'vue-qrcode-reader'
import { QrcodeDropZone } from 'vue-qrcode-reader'
import { defineComponent, h, useRuntimeConfig } from '#imports'

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
  setup(props, { attrs, slots, emit }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
      .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[]
    // TODO: check upstream if above filter is still needed

    return () => h(QrcodeDropZone, {
      ...props,
      ...attrs,
      onDetect: (detectedCodes: DetectedBarcode[]) => {
        props.onDetect?.(detectedCodes)
        emit('detect', detectedCodes)
      },
      onDragover: (isDraggingOver: boolean) => {
        props.onDragover?.(isDraggingOver)
        emit('dragover', isDraggingOver)
      },
      onError: (error: EmittedError) => {
        props.onError?.(error)
        emit('error', error)
      },
      formats,
    }, slots)
  },
})
