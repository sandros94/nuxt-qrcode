import { defineNuxtModule, addComponent, addComponentsDir, addImportsDir, createResolver } from '@nuxt/kit'
import defu from 'defu'

export type * from './runtime/types'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Whether to auto-import upstream components from `vue-qrcode-reader`
   *
   * @default false
   */
  autoImport: boolean
  formats: BarcodeFormat[]
  global: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-qrcode',
    configKey: 'qrcode',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    const qrcode = nuxt.options.runtimeConfig.public.qrcode = defu(
      nuxt.options.runtimeConfig.public.qrcode,
      options,
      {
        autoImport: false,
        formats: [],
        global: false,
      },
    )
    if (qrcode.formats.length === 0) qrcode.formats = ['qr_code']

    addImportsDir(resolve(runtimeDir, 'composables'))

    addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      global: qrcode.global,
      watch: false,
    })

    if (qrcode.autoImport) {
      addComponent({
        name: 'VueQrcodeCapture',
        export: 'QrcodeCapture',
        filePath: 'vue-qrcode-reader',
      })
      addComponent({
        name: 'VueQrcodeDropZone',
        export: 'QrcodeDropZone',
        filePath: 'vue-qrcode-reader',
      })
      addComponent({
        name: 'VueQrcodeStream',
        export: 'QrcodeStream',
        filePath: 'vue-qrcode-reader',
      })
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtOptions {
    qrcode: ModuleOptions
    runtimeConfig: {
      public: {
        qrcode: ModuleOptions
      }
    }
  }
}
