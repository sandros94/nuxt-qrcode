<template>
  <div class="container">
    <select v-model="variant">
      <option value="default">
        Default
      </option>
      <option value="circular">
        Circular
      </option>
      <option value="pixelated">
        Pixelated
      </option>
      <option value="rounded">
        Rounded
      </option>
    </select>
    <input v-model="text" style="width: 100%;">
    <br>
    <Qrcode
      class="qr-code"
      :value="text"
      :variant
    />
  </div>
</template>

<script setup lang="ts">
import type { SVGVariant } from 'nuxt-qrcode'

const text = ref('https://github.com/sandros94/nuxt-qrcode')
const variant = ref<SVGVariant>('default')
</script>

<style scoped>
.container {
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
}

.qr-code {
  width: 36rem;
  height: 36rem;
  max-width: 90svw;
  max-height: 80svh;
}
</style>
