<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

const appConfig = useAppConfig()

const links = [
  {
    label: 'Guide',
    to: '/guide/installation',
  },
  {
    label: 'Generate',
    icon: 'i-lucide-qr-code',
    to: '/generate/qrcode',
  },
  {
    label: 'Read',
    icon: 'i-lucide-camera',
    to: '/read/qrcode-stream',
  },
] satisfies NavigationMenuItem[]

const navigation = computed(() => [
  {
    title: 'Guide',
    icon: 'i-lucide-square-play',
    to: '/guide/installation',
    children: [
      {
        title: 'Installation',
        to: '/guide/installation',
      },
      {
        title: 'Configuration',
        to: '/guide/configuration',
      },
    ]
  },
  {
    title: 'Generate',
    icon: 'i-lucide-qr-code',
    to: '/generate/qrcode',
    children: [
      {
        title: 'Qrcode',
        to: '/generate/qrcode',
      },
    ]
  },
  {
    title: 'Read',
    icon: 'i-lucide-camera',
    to: '/read/qrcode-stream',
    children: [
      {
        title: 'QrcodeStream',
        to: '/read/qrcode-stream',
      },
    ]
  },
])

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

useServerSeoMeta({
  ogSiteName: 'Nuxt QRCode',
  twitterCard: 'summary_large_image',
})

provide('navigation', navigation)
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtLoadingIndicator color="#FFF" />

    <AppHeader :links="links" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <AppFooter :links="links" />
  </UApp>
</template>
