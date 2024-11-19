export default defineNuxtConfig({
  modules: ['../src/module'],
  imports: { autoImport: true },

  devtools: { enabled: true },
  compatibilityDate: '2024-08-22',

  qrcode: {},
})
