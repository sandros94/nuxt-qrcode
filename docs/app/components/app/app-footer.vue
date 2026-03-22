<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter>
    <template #left>
      <p>
        This site is powered by <a href="https://www.netlify.com/" target="_blank" class="underline text-sm text-highlighted">Netlify</a>
      </p>
    </template>

    <NuxtLink
      to="https://github.com/sandros94/nuxt-qrcode/blob/main/LICENSE"
      target="_blank"
      class="text-sm text-muted"
    >
      Published under <span class="text-highlighted">MIT License</span>
    </NuxtLink>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />

      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
