<template>
  <div>
    Test
    <input v-model="text">
    <Qrcode
      style="height: 80svh;"
      :value="text"
      pixel-style="lowpoly"
      marker-inner-style="lowpoly"
      marker-style="lowpoly"
    />
  </div>
</template>

<script setup lang="ts">
const text = ref('https://github.com/sandros94/nuxt-qrcode')
</script>
