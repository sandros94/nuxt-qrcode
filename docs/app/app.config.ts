export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 7500,
  },
  seo: {
    siteName: 'Nuxt QRCode - Docs',
  },
  ui: {
    colors: {
      info: 'sky',
    },
  },
})
