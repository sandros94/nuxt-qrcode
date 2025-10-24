import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    'nuxt-llms',
    '@nuxtjs/plausible',
    'nuxt-component-meta',
    '@nuxtjs/plausible',
    (_, nuxt) => {
      nuxt.hook('components:dirs', (dirs) => {
        dirs.unshift({ path: resolve('./app/components/content/examples'), pathPrefix: false, prefix: '', global: true })
      })
    },
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

  site: {
    url: 'https://qrcode.s94.dev',
    name: 'Nuxt QRCode - Docs',
  },

  content: {
    experimental: {
      nativeSqlite: true,
    },
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

  compatibilityDate: '2025-09-30',

  nitro: {
    output: {
      dir: '../.output',
      serverDir: '../.output/server',
      publicDir: '../.output/public',
    },
  },

  componentMeta: {
    exclude: [
      '@nuxt/content',
      '@nuxt/icon',
      '@nuxt/image',
      '@nuxt/ui',
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

  llms: {
    domain: 'https://qrcode.s94.dev',
    title: 'Nuxt QRCode - Docs',
    description: 'A Nuxt module that provides support for generating and reading QRCodes.',
  },

  ogImage: {
    enabled: false,
  },

  plausible: {
    apiHost: 'https://plausible.digitoolmedia.com',
  },
})
