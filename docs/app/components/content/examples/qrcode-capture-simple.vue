<template>
  <div>
    <QrcodeCapture
      class="border px-2 py-1 border-gray-300 rounded-lg"
      @detect="onDetect"
    />
    <div class="pt-4">
      <h5>
        Scanned QRCodes:
      </h5>
      <ul v-if="result" class="list-disc pl-4">
        <li v-for="(r, i) in result" :key="i">
          <span class="text-wrap wrap-anywhere">
            {{ r }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from 'nuxt-qrcode'

const toast = useToast()

const result = ref<string[]>()

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
</script>
