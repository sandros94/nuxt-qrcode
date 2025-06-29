<template>
  <UContainer>
    <UInput v-model="text" />
    <USelect v-model="variant" :items="variants" />
    <img class="w-full h-full" :src="qr" alt="QR Code">
  </UContainer>
</template>

<script setup lang="ts">
import type { SVGVariant } from 'nuxt-qrcode'

const text = ref('Hello World')
const variant = ref<SVGVariant>('pixelated')
const variants = ref(['pixelated', 'dots', 'rounded', 'squares', 'circles'])

const qr = useQrcode(text, {
  toBase64: true,
  variant,
})
</script>
