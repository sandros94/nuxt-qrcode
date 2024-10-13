import { defineNuxtModule, addComponent, addComponentsDir, addImportsDir, createResolver } from '@nuxt/kit'
import defu from 'defu'

import type { RenderSVGOptions } from './runtime/utils/qrcode/svg/render'

export type * from './runtime/types/index'

// Module options TypeScript interface definition
export interface ModuleOptions {
  reader: {
    /**
     * Whether to auto-import upstream components from `vue-qrcode-reader`
     *
     * @default false
     */
    autoImport?: boolean
    formats?: BarcodeFormat[]
    global?: boolean
  }
  options: Omit<RenderSVGOptions, 'onEncoded'>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-qrcode',
    configKey: 'qrcode',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    reader: {
      autoImport: false,
      formats: [],
      global: false,
    },
    options: {
      ecc: 'L',
      maskPattern: -1,
      boostEcc: undefined,
      minVersion: 1,
      maxVersion: 40,
      border: 1,
    },
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    nuxt.options.alias['#qrcode'] = runtimeDir

    const qrcode = nuxt.options.runtimeConfig.public.qrcode = defu(
      nuxt.options.runtimeConfig.public.qrcode,
      options,
    )
    if (qrcode.reader.formats?.length === 0) qrcode.reader.formats = ['qr_code']

    addImportsDir(resolve(runtimeDir, 'composables'))

    addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      global: qrcode.reader.global,
      watch: false,
    })

    if (qrcode.reader.autoImport) {
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
