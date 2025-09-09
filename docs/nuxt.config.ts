import { createResolver } from '@nuxt/kit'
import pkg from '../package.json'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-llms',
    'nuxt-og-image',
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

  image: {
    provider: 'ipx',
  },

  llms: {
    domain: 'https://qrcode.s94.dev',
    title: 'Nuxt QRCode - Docs',
    description: 'A Nuxt module that provides support for generating and reading QRCodes.',
  },

  ogImage: {
    fonts: [
      {
        name: 'Public+Sans',
        weight: 400,
        path: '/public/PublicSans.ttf',
      },
      {
        name: 'Public+Sans:italic',
        weight: 400,
        path: '/public/PublicSans-Italic.ttf',
      },
    ],
  },

  plausible: {
    apiHost: 'https://plausible.digitoolmedia.com',
  },
})
