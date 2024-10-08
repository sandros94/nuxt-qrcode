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
  - [ ] provide custom Nuxt component to wrap upstream components with opinionated logic
- Generate QRCodes
  - [x] provide upstream from [unjs/uqr](https://github.com/unjs/uqr)
  - [ ] composable full of utils to generate qrcodes
  - [ ] provide custom Nuxt component to render QR Codes

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

TODO: add examples to readme, for now follow what is available from the upstream docs or current [playground](/playground/).

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
