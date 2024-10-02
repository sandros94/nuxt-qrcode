<template>
  <div>
    <div v-if="!state.error">
      <QrcodeStream
        @error="onError"
        @detect="onDetect"
      />
      <div v-if="result">
        <h5>
          Scanned QRCodes
        </h5>
        <ul>
          <li v-for="(r, i) in result" :key="i">
            {{ r }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <h3>
        {{ state.errorMsg }}
      </h3>
      <button @click="state.error = false">
        reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from 'nuxt-qrcode'

const result = ref<string[]>()
const state = reactive({
  errorMsg: '',
  error: false,
})

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map(code => code.rawValue)
}

function onError(err: any) {
  state.error = true
  state.errorMsg = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    state.errorMsg += 'you need to grant camera access permission'
  }
  else if (err.name === 'NotFoundError') {
    state.errorMsg += 'no camera on this device'
  }
  else if (err.name === 'NotSupportedError') {
    state.errorMsg += 'secure context required (HTTPS, localhost)'
  }
  else if (err.name === 'NotReadableError') {
    state.errorMsg += 'is the camera already in use?'
  }
  else if (err.name === 'OverconstrainedError') {
    state.errorMsg += 'installed cameras are not suitable'
  }
  else if (err.name === 'StreamApiNotSupportedError') {
    state.errorMsg += 'Stream API is not supported in this browser'
  }
  else if (err.name === 'InsecureContextError') {
    state.errorMsg
        += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  }
  else {
    state.errorMsg += err.message
  }
}
</script>
