import { defineNuxtModule, addComponent, addImportsDir, createResolver, installModule } from '@nuxt/kit'
import type { BarcodeFormats } from './runtime/types'
import defu from 'defu'
import { fileURLToPath } from 'url'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Whether to auto-import upstream components from `vue-qrcode-reader`
   * 
   * @default false
   */
  autoImport: boolean
  barcodeFormats: BarcodeFormats
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    autoImport: false,
    barcodeFormats: {
      aztec: false,
      code_128: false,
      code_39: false,
      code_93: false,
      codabar: false,
      databar: false,
      databar_expanded: false,
      data_matrix: false,
      dx_film_edge: false,
      ean_13: false,
      ean_8: false,
      itf: false,
      maxi_code: false,
      micro_qr_code: false,
      pdf417: false,
      qr_code: true,
      rm_qr_code: false,
      upc_a: false,
      upc_e: false,
      linear_codes: false,
      matrix_codes: false,
      unknown: false,
    }
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    const nuxtQrcode = nuxt.options.runtimeConfig.public.nuxtQrcode = defu(
      nuxt.options.runtimeConfig.public.nuxtQrcode,
      {
        autoImport: options.autoImport,
        barcodeFormats: options.barcodeFormats
      }
    )

    await installModule('@vueuse/nuxt')

    addImportsDir(resolve(runtimeDir, 'composables'))

    if (nuxtQrcode.autoImport) {
      addComponent({
        name: 'QrcodeCapture',
        export: 'QrcodeCapture',
        filePath: 'vue-qrcode-reader',
      })
      addComponent({
        name: 'QrcodeDropZone',
        export: 'QrcodeDropZone',
        filePath: 'vue-qrcode-reader',
      })
      addComponent({
        name: 'QrcodeStream',
        export: 'QrcodeStream',
        filePath: 'vue-qrcode-reader',
      })
    }
  }
})

declare module '@nuxt/schema' {
  interface NuxtOptions {
    nuxtQrcode?: ModuleOptions;
    runtimeConfig: {
      public: {
        nuxtQrcode: ModuleOptions;
      };
    };
  }
}
