# Nuxt QRCode

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt QRCode is a module to provide easy support in reading and creating [QR Codes](https://en.wikipedia.org/wiki/QR_code).

> [!Important]
> This module is still a work in progress.
> Expect breaking changes to adjust the aim. Feel free to open issue to discuss use cases.

### Current Roadmap

The following are the features that I'm currently working on and plan to release in the upcoming days/weeks

- Read QRCodes
  - [x] provide upstream components from [vue-qrcode-reader](https://github.com/gruhn/vue-qrcode-reader)
  - [x] composable full of utils to go along with the upstream components
  - [x] provide custom Nuxt component to wrap upstream components with opinionated logic
- Generate QRCodes
  - [x] provide upstream from [unjs/uqr](https://github.com/unjs/uqr)
  - [x] composable full of utils to generate qrcodes
    - [ ] server utils
  - [x] provide custom Nuxt component to render QR Codes
    - [x] svg
    - [ ] png

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-qrcode?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- ✨ &nbsp;Ease of use
- 🔋 &nbsp;Battery included (opinioneted components)
- 🧩 &nbsp;Extensible (upstream components + utility functions from this module)
- 📷 &nbsp;Read QR Codes
- 📝 &nbsp;Create QR Codes
- 📘 &nbsp;Typescript support

## Quick Setup

1. Add `nuxt-qrcode` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-qrcode

# Using yarn
yarn add --dev nuxt-qrcode

# Using npm
npm install --save-dev nuxt-qrcode
```

2. Add `nuxt-qrcode` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-qrcode'
  ]
})
```

That's it! You can now use Nuxt QRCode in your Nuxt app ✨

## How to use it

### Customize defaults

You can set default options within your `nuxt.config.ts`

#### `Qrcode` and `useQrcode`

You can customize things like:
- default variant style
- radius (`0` is none, `1` is full)
- and css color for black and white pixels

```ts
export default defineNuxtConfig({
  modules: ['nuxt-qrcode'],

  qrcode: {
    options: {
      variant: 'pixelated',
      // OR
      variant: {
        inner: 'circle',
        marker: 'rounded',
        pixel: 'rounded',
      },
      radius: 1,
      blackColor: 'currentColor', // 'var(--ui-text-highlighted)' if you are using `@nuxt/ui` v3
      whiteColor: 'transparent',  // 'var(--ui-bg)'
    },
  },
})
```

### Use the components

#### `Qrcode`

The `Qrcode` component only requires a `value` prop to work

```vue
<template>
  <div>
    <Qrcode
      value="My string to encode"
      variant="pixelated"
    />
  </div>
</template>
```

But it also accepts all the same props available at `qrcode.options` in your `nuxt.config.ts`.

#### `QrcodeStream`

Ready to use component to capture and decode a live feed from the device's camera. As simple as:

```vue
<template>
  <div>
    <QrcodeStream
      @error="onError"
      @detect="onDetect"
    />
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from 'nuxt-qrcode'

function onDetect(detectedCodes: DetectedBarcode[]) {
  // do something with decoded qrcodes `DetectedBarcode['rawValue']
}

function onError(err: Error) {
  // do something on stream error
}
</script>
```

#### `QrcodeCaptrue` and `QrcodeDropZone`

TODO: add examples, for now follow what is available from the [upstream docs](https://gruhn.github.io/vue-qrcode-reader/) or current [playground](/playground/) implementation.

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the playground
pnpm run dev:build

# Run ESLint
pnpm run lint

# Run Vitest
pnpm run test
pnpm run test:watch

# Release new version
pnpm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-qrcode/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-qrcode

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-qrcode.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-qrcode

[license-src]: https://img.shields.io/npm/l/nuxt-qrcode.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-qrcode

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
