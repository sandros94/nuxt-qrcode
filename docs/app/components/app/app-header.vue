<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { version } = useRuntimeConfig().public

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const links = useLinks()

const { header } = useAppConfig()
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="header.to"
    :title="header.title"
  >
    <UNavigationMenu :items="links" variant="link" class="w-full justify-center" />

    <template #left>
      <NuxtLink
        :to="header.to"
        class="flex items-end gap-2 font-bold text-xl text-[var(--ui-text-highlighted)] min-w-0 focus-visible:outline-[var(--ui-primary)]"
      >
        {{ header.title }}

        <UBadge
          :label="`v${version}`"
          variant="subtle"
          size="sm"
          class="font-semibold inline-block truncate place-self-center"
        />
      </NuxtLink>
    </template>

    <template #body>
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>

    <template #right>
      <UContentSearchButton v-if="header.search" />

      <UColorModeButton v-if="header.colorMode" />

      <template v-if="header.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UHeader>
</template>
