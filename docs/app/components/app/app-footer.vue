<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()
</script>

<template>
  <USeparator
    icon="i-simple-icons-nuxtdotjs"
    class="h-px"
  />

  <UFooter>
    <template #left>
      <NuxtLink
        to="https://github.com/sandros94/nuxt-qrcode"
        target="_blank"
        class="text-sm text-[var(--ui-text-muted)]"
      >
        Published under <span class="text-[var(--ui-text-highlighted)]">MIT License</span>
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
    />

    <template #right>
      <UButton
        aria-label="Nuxt QRCode on GitHub"
        icon="i-simple-icons-github"
        to="https://github.com/sandros94/nuxt-qrcode"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
