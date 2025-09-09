export function useLinks() {
  const route = useRoute()

  return computed(() => [
    {
      label: 'Guide',
      icon: 'i-lucide-square-play',
      // to: '/guide',
      active: route.path.startsWith('/guide'),
      children: [
        {
          icon: 'i-lucide-arrow-right',
          label: 'Installation',
          description: 'Learn how to install Nuxt QRCode in your Nuxt application',
          to: '/guide/installation',
          active: route.path === '/guide/installation',
        },
        {
          icon: 'i-lucide-cog',
          label: 'Configuration',
          description: 'Learn how to configure Nuxt QRCode in your Nuxt application',
          to: '/guide/configuration',
          active: route.path === '/guide/configuration',
        },
      ],
    },
    {
      label: 'Generate',
      icon: 'i-lucide-qr-code',
      // to: '/generate',
      active: route.path.startsWith('/generate'),
      children: [
        {
          icon: 'i-lucide-square-code',
          label: 'QRCode Component',
          description: 'Learn how to generate QRCodes using the related component.',
          to: '/generate/qrcode',
          active: route.path === '/generate/qrcode',
        },
        {
          icon: 'i-lucide-image',
          label: 'useQrcode Composable',
          description: 'Learn how to generate QRCodes with base64 support.',
          to: '/generate/use-qrcode',
          active: route.path === '/generate/use-qrcode',
        },
      ],
    },
    {
      label: 'Read',
      icon: 'i-lucide-scan-qr-code',
      // to: '/read',
      active: route.path.startsWith('/read'),
      children: [
        {
          icon: 'i-lucide-camera',
          label: 'QrcodeStream',
          description: 'Learn how to read QRCodes live from a camera stream.',
          to: '/read/qrcode-stream',
          active: route.path === '/read/qrcode-stream',
        },
        {
          icon: 'i-lucide-file-scan',
          label: 'QrcodeCapture',
          description: 'Learn how to read QRCodes from a file input.',
          to: '/read/qrcode-capture',
          active: route.path === '/read/qrcode-capture',
        },
        {
          icon: 'i-lucide-square-mouse-pointer',
          label: 'QrcodeDropZone',
          description: 'Learn how to read QRCodes by dropping files.',
          to: '/read/qrcode-drop-zone',
          active: route.path === '/read/qrcode-drop-zone',
        },
      ],
    },
  ])
}
