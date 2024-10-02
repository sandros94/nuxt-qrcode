<template>
  <div>
    Test
    <input v-model="text">
    <Qrcode style="height: 80svh;" :value="text" />
  </div>
</template>

<script setup lang="ts">
const text = ref('')
</script>
