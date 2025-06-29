<template>
  <div>
    <input v-model="text">
    <br>
    <img :src="qrcode" style="width: 512px; height: 512px;">
    <br>
    <img v-if="data" :src="data" style="width: 512px; height: 512px;">
    {{ data }}
  </div>
</template>

<script setup lang="ts">
const text = ref('ciao')

const qrcode = useQrcode(text, {
  variant: 'rounded',
  toBase64: true,
})
const { data } = await useFetch<string>('/api/generate', {
  method: 'POST',
  body: {
    data: text,
  },
  watch: [text],
})
</script>
