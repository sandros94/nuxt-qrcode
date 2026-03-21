export default defineNuxtConfig({
  modules: ['nuxt-qrcode'],
  imports: { autoImport: true },

  devtools: { enabled: true },
  compatibilityDate: '2025-09-30',

  qrcode: {},
})
