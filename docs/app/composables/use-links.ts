export function useLinks() {
  const route = useRoute()

  return computed(() => [
    {
      label: 'Guide',
      icon: 'i-lucide-square-play',
      to: '/guide',
      active: route.path.startsWith('/guide'),
      children: [
        {
          icon: 'i-lucide-arrow-right',
          label: 'Installation',
          to: '/guide/installation',
          description: 'Learn how to install Nuxt QRCode in your Nuxt application',
          active: route.path === '/guide/installation',
        },
        {
          icon: 'i-lucide-cog',
          label: 'Configuration',
          to: '/guide/configuration',
          description: 'Learn how to configure Nuxt QRCode in your Nuxt application',
          active: route.path === '/guide/configuration',
        },
      ],
    },
    {
      label: 'Generate',
      icon: 'i-lucide-qr-code',
      to: '/generate',
      active: route.path.startsWith('/generate'),
      children: [
        {
          icon: 'i-lucide-square-code',
          label: 'QRCode Component',
          to: '/generate/qrcode',
          description: 'Learn how to generate QRCodes using the related component.',
          active: route.path === '/generate/qrcode',
        },
      ],
    },
    {
      label: 'Read',
      icon: 'i-lucide-camera',
      to: '/read',
      active: route.path.startsWith('/read'),
      children: [
        {
          icon: 'i-lucide-scan-qr-code',
          label: 'QRCodeStream',
          to: '/read/qrcode-stream',
          description: 'Learn how to read QRCodes using the related component.',
          active: route.path === '/read/qrcode-stream',
        },
      ],
    },
  ])
}
