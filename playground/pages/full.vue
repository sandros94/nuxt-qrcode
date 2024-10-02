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

      <select v-model="track">
        <option
          v-for="{ label, value } in trackOptions"
          :key="label"
          :value="value"
        >
          {{ label }}
        </option>
      </select>
    </p>

    <p>
      By default only QR-codes are detected but a variety of other barcode formats are also
      supported. You can select one or multiple but the more you select the more expensive scanning
      becomes: <br>

      <span
        v-for="option in Object.keys(availableFormats)"
        :key="option"
        class="barcode-format-checkbox"
      >
        <input
          :id="option"
          v-model="availableFormats[option as BarcodeFormat]"
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
        :track
        :formats
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
import type { BarcodeFormat, DetectedBarcode } from 'nuxt-qrcode'

const {
  availableFormats,
  cameras,
  selectedCamera,
  formats,
  trackOptions,
  track,
} = useQrcodeRead()

const result = ref<string[]>()
const error = ref('')

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map(code => code.rawValue)
}

function onError(err: Error) {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'you need to grant camera access permission'
  }
  else if (err.name === 'NotFoundError') {
    error.value += 'no camera on this device'
  }
  else if (err.name === 'NotSupportedError') {
    error.value += 'secure context required (HTTPS, localhost)'
  }
  else if (err.name === 'NotReadableError') {
    error.value += 'is the camera already in use?'
  }
  else if (err.name === 'OverconstrainedError') {
    error.value += 'installed cameras are not suitable'
  }
  else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API is not supported in this browser'
  }
  else if (err.name === 'InsecureContextError') {
    error.value
        += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  }
  else {
    error.value += err.message
  }
}
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
