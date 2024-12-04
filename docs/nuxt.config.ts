import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '../src/module',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-og-image',
    'nuxt-component-meta',
    '@nuxtjs/plausible',
  ],

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          href: '/favicon.svg',
          type: 'image/svg+xml',
        },
      ],
    },
  },

  css: [
    '~/assets/css/main.css',
  ],

  site: {
    url: 'https://qrcode.s94.dev',
  },

  content: {
    highlight: {
      langs: ['bash', 'ts', 'diff', 'vue', 'json', 'yml'],
    },
  },

  // uiPro: { license: 'oss' },

  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },

  // TODO: remove once propper landing page is available
  routeRules: {
    '/': { redirect: '/guide/installation', prerender: false },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-07-09',

  componentMeta: {
    exclude: [
      '@nuxt/content',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxt/ui-pro',
      '@nuxtjs/color-mode',
      '@nuxtjs/mdc',
      '@nuxtjs/plausible',
      'nuxt/dist',
      'nuxt-og-image',
      resolve('./app/components'),
    ],
    metaFields: {
      type: false,
      props: true,
      slots: true,
      events: true,
      exposed: false,
    },
  },

  icon: {
    clientBundle: {
      scan: true,
    },
    provider: 'iconify',
  },

  image: {
    provider: 'ipx',
  },
})
