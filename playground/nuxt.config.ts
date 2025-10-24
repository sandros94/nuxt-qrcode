export default defineNuxtConfig({
  modules: ['../src/module'],
  imports: { autoImport: true },

  devtools: { enabled: true },
  compatibilityDate: '2025-09-30',

  qrcode: {},
})
