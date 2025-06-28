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
            <span class="text-wrap wrap-anywhere">
              {{ r }}
            </span>
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

const toast = useToast()

const result = ref<string[]>()
const state = reactive({
  errorMsg: '',
  error: false,
})

function onDetect(detectedCodes: DetectedBarcode[]) {
  result.value = detectedCodes.map((code) => {
    toast.add({
      title: 'Detected',
      description: `Value: ${code.rawValue}`,
      actions: [
        {
          label: 'Copy',
          onClick: () => {
            navigator.clipboard.writeText(code.rawValue)
          },
        },
      ],
    })
    return code.rawValue
  })
}

function onError(err: Error) {
  state.error = true
  state.errorMsg = `[${err.name}]: ${err.message}`
}
</script>
