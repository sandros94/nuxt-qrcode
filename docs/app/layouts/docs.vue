<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UPage class="px-4 sm:px-6 lg:px-8">
    <template #left>
      <UPageAside class="lg:w-72">
        <UContentNavigation
          highlight
          :navigation="navigation"
        />
      </UPageAside>
    </template>

    <UContainer class="max-w-[52rem]">
      <slot />
    </UContainer>

    <template #right>
      <UPageAside class="lg:w-72 lg:justify-self-end">
        <div id="aside-toc" />
      </UPageAside>
    </template>
  </UPage>
</template>
