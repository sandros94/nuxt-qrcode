import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/image',
    '@nuxt/ui-pro',
    '@nuxt/content',
    'nuxt-llms',
    'nuxt-og-image',
    '@nuxtjs/plausible',
    'nuxt-component-meta',
    '@nuxtjs/plausible',
  ],

  $development: {
    site: {
      url: 'http://localhost:3000',
    },
  },
  $production: {
    site: {
      url: 'https://qrcode.s94.dev',
    },
  },

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

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['bash', 'ts', 'diff', 'vue', 'json', 'yml'],
        },
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  mdc: {
    highlight: {
      noApiRoute: false,
    },
  },

  // uiPro: { license: 'oss' },

  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    buildCache: true,
  },

  compatibilityDate: '2025-06-09',

  vite: {
    optimizeDeps: {
      include: ['debug'],
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

  llms: {
    domain: 'https://qrcode.s94.dev',
    title: 'Nuxt QRCode - Docs',
    description: 'A Nuxt module that provides support for generating and reading QRCodes.',
  },

  plausible: {
    apiHost: 'https://plausible.digitoolmedia.com',
  },
})
