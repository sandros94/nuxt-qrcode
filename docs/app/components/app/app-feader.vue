<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const { version } = useRuntimeConfig().public

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const links = parseNavigation(navigation)

const { header } = useAppConfig()

function parseNavigation(contentNavigation?: Ref<ContentNavigationItem[]>): Ref<NavigationMenuItem[]> {
  return computed(() => {
    if (!contentNavigation?.value) return []

    const navigation = contentNavigation.value
    const items: NavigationMenuItem[] = []

    navigation.forEach((item) => {
      const children = item.children?.map(child => ({
        label: child.title,
        to: child.page !== false
          ? child.path
          : undefined,
        icon: child.icon as string | undefined,
        children: child.children
          ? child.children.map(subChild => ({
              label: subChild.title,
              to: subChild.page !== false
                ? subChild.path
                : undefined,
            }))
          : undefined,
      }))

      items.push({
        label: item.title,
        to: item.page !== false
          ? item.path
          : undefined,
        icon: item.icon as string | undefined,
        children,
      })
    })

    return items
  })
}
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
