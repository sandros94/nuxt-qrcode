---
seo:
  title: Nuxt QRCode - Docs
  description: A Nuxt module that provides support for generating and reading QRCodes.
---

::u-page-hero
---
orientation: horizontal
---
  :::prose-pre{filename="Terminal" code="npx nuxi module add nuxt-qrcode"}
  ```bash
  npx nuxi module add nuxt-qrcode
  ```
  :::

#title
QRCodes

made easy

#description
A Nuxt module that provides support for generating and reading QRCodes.

#links
  :::u-button
  ---
  size: xl
  to: /guide/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  <!-- :::u-button
  ---
  color: neutral
  size: xl
  to: /examples
  variant: subtle
  trailing-icon: i-lucide-qr-code
  ---
  Examples
  ::: -->
::

::u-page-section
#title
Integrated concepts and features

#features
  :::u-page-feature
  ---
  icon: i-lucide-cog
  to: /guide/configuration
  ---
  #title
  Global Styling

  #description
  Customize the default styles of the QRCode component or automatically integrate it with Nuxt UI.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-qr-code
  to: /generate/qrcode
  ---
  #title
  QRCode Generation

  #description
  Generate QRCodes with ease using the `Qrcode` component or the `useQrcode` composable.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-camera
  to: /read/qrcode-stream
  ---
  #title
  QRCode Reading

  #description
  Read QRCodes using the `QrcodeStream`, `QrcodeDropZone`, `QrcodeCapture` components (powered by [vue-qrcode-reader](https://github.com/gruhn/vue-qrcode-reader)).
  :::
::
