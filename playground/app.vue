<template>
  <div>
    <p>
      Modern mobile phones often have a variety of different cameras installed (e.g. front, rear,
      wide-angle, infrared, desk-view). The one picked by default is sometimes not the best choice.
      If you want fine-grained control, which camera is used, you can enumerate all installed
      cameras and then pick the one you need based on it's device ID:

      <select v-model="selectedCamera">
        <option
          v-for="camera in cameras"
          :key="camera.label"
          :value="camera"
        >
          {{ camera.label }}
        </option>
      </select>
    </p>

    <p>
      Detected codes are visually highlighted in real-time. Use the following dropdown to change the
      flavor:

      <select v-model="trackFunctionSelected">
        <option
          v-for="option in trackFunctionOptions"
          :key="option.text"
          :value="option"
        >
          {{ option.text }}
        </option>
      </select>
    </p>

    <p>
      By default only QR-codes are detected but a variety of other barcode formats are also
      supported. You can select one or multiple but the more you select the more expensive scanning
      becomes: <br>

      <span
        v-for="option in Object.keys(barcodeFormats)"
        :key="option"
        class="barcode-format-checkbox"
      >
        <input
          :id="option"
          v-model="barcodeFormats[option as BarcodeFormat]"
          type="checkbox"
        >
        <label :for="option">{{ option }}</label>
      </span>
    </p>

    <p class="error">
      {{ error }}
    </p>

    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <div>
      <QrcodeStream
        v-if="selectedCamera !== null"
        :constraints="{ deviceId: selectedCamera.deviceId }"
        :track="trackFunctionSelected.value"
        :formats="selectedFormats"
        @error="onError"
        @detect="onDetect"
      />
      <p
        v-else
        class="error"
      >
        No cameras on this device
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'
import type { BarcodeFormat } from '../src/runtime/types'
import { useQrcodeRead } from '#imports'

const {
  barcodeFormats,
  cameras,
  error,
  onDetect,
  onError,
  selectedCamera,
  selectedFormats,
  result,
  trackFunctionOptions,
  trackFunctionSelected,
} = useQrcodeRead()
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
.barcode-format-checkbox {
  margin-right: 10px;
  white-space: nowrap;
}
</style>
