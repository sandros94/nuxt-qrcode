<template>
  <div class="container">
    <label>
      <input v-model="invert" type="checkbox">
      Inverted
    </label>
    <select v-model="variant">
      <option value="default">
        Default
      </option>
      <option value="dots">
        Dots
      </option>
      <option value="circle">
        Circle
      </option>
      <option value="pixelated">
        Pixelated
      </option>
      <option value="rounded">
        Rounded
      </option>
    </select>
    <input
      v-if="variant === 'dots' || variant === 'circle' || variant === 'rounded'"
      v-model.number="radius"
      type="range"
      min="0"
      max="1"
      step="0.05"
    >
    <input v-model="text" style="width: 100%;">
    <br>
    <Qrcode
      class="qr-code"
      :value="text"
      :variant
      :radius
      :invert
      @encoded="({ data }) => console.log(`Encoded: ${data.length} bytes\n`)"
    />
  </div>
</template>

<script setup lang="ts">
import type { SVGVariant } from 'nuxt-qrcode'

const text = ref('https://github.com/sandros94/nuxt-qrcode')
const variant = ref<SVGVariant>('default')
const radius = ref(0.5)
const invert = ref(false)
</script>

<style scoped>
.container {
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
}

.qr-code {
  width: 48rem;
  height: 48rem;
  max-width: 90svw;
  max-height: 80svh;
}
</style>
