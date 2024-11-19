<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

defineProps<{
  links: NavigationMenuItem[]
}>()

const { version } = useRuntimeConfig().public

defineShortcuts({
  meta_g: () => {
    window.open('https://github.com/sandros94/nuxt-qrcode', '_blank')
  },
})
</script>

<template>
  <UHeader :ui="{ left: 'min-w-0' }">
    <template #left>
      <NuxtLink
        to="/"
        class="flex items-end gap-2 font-bold text-xl text-[var(--ui-text-highlighted)] min-w-0 focus-visible:outline-[var(--ui-primary)]"
        aria-label="Nuxt UI"
      >
        Nuxt QRCode

        <UBadge
          :label="`v${version}`"
          variant="subtle"
          size="sm"
          class="font-semibold inline-block truncate place-self-center"
        />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="links"
      variant="link"
    />

    <template #right>
      <UTooltip
        text="Search"
        :kbds="['meta', 'K']"
      >
        <UContentSearchButton />
      </UTooltip>

      <UTooltip
        text="Open on GitHub"
        :kbds="['meta', 'G']"
      >
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/sandros94/nuxt-qrcode"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #content>
      <UNavigationMenu
        orientation="vertical"
        class="-ml-2.5"
        :items="links"
      />
    </template>
  </UHeader>
</template>
