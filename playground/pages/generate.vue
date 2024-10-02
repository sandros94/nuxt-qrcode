<template>
  <div>
    Test
    <input v-model="text">
    <pre>
      {{ data }}
    </pre>
  </div>
</template>

<script setup lang="ts">
const text = ref('')
const { data } = useQrcode(text)
</script>
