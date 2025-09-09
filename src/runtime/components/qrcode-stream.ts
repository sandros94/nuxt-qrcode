import type { ComponentObjectPropsOptions, ComponentOptionsMixin, SlotsType } from 'vue'
import type { BarcodeFormat, QrcodeStreamProps, EmittedError, DetectedBarcode } from 'vue-qrcode-reader'
import { QrcodeStream } from 'vue-qrcode-reader'
import { defineComponent, h, useRuntimeConfig } from '#imports'

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

export interface QrcodeStreamSlots extends SlotsType {
  default?: (props: {}) => any
}

export default defineComponent<QrcodeStreamProps, ComponentObjectPropsOptions, string, QrcodeStreamEmits, {}, string, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, QrcodeStreamSlots>({
  name: 'QrcodeStream',
  setup(props, { attrs, slots }) {
    const formats = (props.formats || useRuntimeConfig().public.qrcode.reader.formats)
      .filter(f => f !== 'databar_limited' && f !== 'any') as Exclude<BarcodeFormat, 'databar_limited' | 'any'>[]
    // TODO: check upstream if above filter is still needed

    return () => h(QrcodeStream, {
      ...props,
      ...attrs,
      formats,
    }, slots)
  },
})
