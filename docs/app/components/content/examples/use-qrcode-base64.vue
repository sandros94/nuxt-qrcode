<template>
  <img class="w-full h-full" :src="qr" alt="QR Code">
</template>

<script setup lang="ts">
const qr = useQrcode('https://nuxt.com', {
  toBase64: true,
})
</script>
