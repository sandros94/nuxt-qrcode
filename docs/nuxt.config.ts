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
  imports: { autoImport: true },

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

  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },

  compatibilityDate: '2026-03-14',

  nitro: {
    prerender: {
      routes: [
        '',
      ],
      crawlLinks: true,
    },
    output: {
      dir: '../.output',
    },
  },

  vite: {
    optimizeDeps: {
      include: ['extend'],
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
      slots: 'no-schema',
      events: 'no-schema',
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

  qrcode: {
    global: true,
  },

  sitemap: {
    zeroRuntime: true,
  },
})
