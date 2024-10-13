<template>
  <div style="width: fit-content;">
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
      style="height: 80svh;"
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
