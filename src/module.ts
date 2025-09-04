import {
  defineNuxtModule,
  addComponent,
  addComponentsDir,
  addImportsDir,
  addServerImportsDir,
  createResolver,
  hasNuxtModule,
  hasNuxtModuleCompatibility,
} from '@nuxt/kit'
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

    /**
     * Whether to register the reader components globally
     *
     * @deprecated use `qrcode.global` instead
     */
    global?: boolean
  }
  /**
   * Whether to register the components globally
   *
   * @default false
   */
  global?: boolean
  options: Omit<RenderSVGOptions, 'onEncoded'> & {
    disableNuxtUiIntegration?: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-qrcode',
    configKey: 'qrcode',
    compatibility: {
      nuxt: '>=3.0.0 || >=4.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    reader: {
      autoImport: false,
      formats: [],
      global: false,
    },
    global: false,
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

    const useNuxtUi
      = (hasNuxtModule('@nuxt/ui-pro') && await hasNuxtModuleCompatibility('@nuxt/ui-pro', '^3'))
        || (hasNuxtModule('@nuxt/ui') && await hasNuxtModuleCompatibility('@nuxt/ui', '^3'))
    if (useNuxtUi && !qrcode.options.disableNuxtUiIntegration) {
      qrcode.options.blackColor = 'var(--ui-text-highlighted, #000000)'
      qrcode.options.whiteColor = 'var(--ui-bg, #FFFFFF)'
    }

    addImportsDir(resolve(runtimeDir, 'composables'))

    addComponentsDir({
      path: resolve(runtimeDir, 'components'),
      global: qrcode.global || qrcode.reader.global,
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

    addServerImportsDir(resolve(runtimeDir, 'server', 'utils'))
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
