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

function onError(err: Error) {
  state.error = true
  state.errorMsg = `[${err.name}]: ${err.message}`
}
</script>
