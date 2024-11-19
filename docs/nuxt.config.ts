import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-og-image',
    'nuxt-component-meta',
    '@nuxtjs/plausible',
  ],

  css: [
    '~/assets/css/main.css',
  ],

  site: {
    url: 'https://qrcode.s94.dev'
  },

  future: {
    compatibilityVersion: 4,
  },

  // uiPro: { license: 'oss' },

  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },

  icon: {
    clientBundle: {
      scan: true,
    },
    provider: 'iconify',
  },

  content: {
    highlight: {
      langs: ['bash', 'ts', 'diff', 'vue', 'json', 'yml'],
    },
  },

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
      resolve('./app/components')
    ],
    metaFields: {
      type: false,
      props: true,
      slots: true,
      events: true,
      exposed: false
    }
  },

  image: {
    provider: 'ipx',
  },

  // TODO: remove once propper landing page is available
  routeRules: {
    '/': { redirect: '/guide/installation', prerender: false },
  },

  compatibilityDate: '2024-07-09',
})
