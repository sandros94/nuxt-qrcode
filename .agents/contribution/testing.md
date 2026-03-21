# Testing

This project uses three Vitest test types. Run them with:

```bash
pnpm test            # all vitest tests
pnpm test:unit       # unit only
pnpm test:nuxt       # nuxt environment only
pnpm test:e2e        # e2e only (builds the playground)
pnpm test:types      # type-check only
```

Each script is independent — `test` does **not** run lint or type-check.

> **Note:** The vitest config and test scripts are still being set up. The target structure is described below. When adding a new test type, update `vitest.config.ts` (or add workspace configs) and `package.json` scripts accordingly.

## Test Types

### Unit Tests

**Directory:** `test/unit/`
**Environment:** `node` — no Nuxt, no DOM, no Vue runtime.

Use for pure functions that have no dependency on Nuxt runtime features (`#imports`, `useRuntimeConfig`, auto-imports, etc.). The module has a significant amount of pure logic that can be tested this way:

- SVG rendering: `renderSVG`, `renderSVGBase64`, `renderSVGBody`
- SVG variant functions (circle, dots, pixelated, rounded, default)
- Marker and pixel rendering
- Utility helpers: `base64Encode`, `getColors`, `getSize`, `getRadius`, `getVariant`

```ts
import { describe, it, expect } from 'vitest'
import { renderSVG } from '../../src/runtime/utils/qrcode/svg/render'

describe('renderSVG', () => {
  it('generates valid svg string', () => {
    const svg = renderSVG('https://example.com')
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
  })

  it('applies variant option', () => {
    const svg = renderSVG('test', { variant: 'dots' })
    expect(svg).toMatchSnapshot()
  })
})
```

Import paths must be relative — no `~/`, `#imports`, `#qrcode`, or auto-imports. Functions under `src/runtime/utils/` are good candidates because they use only `uqr` and Web APIs, not Nuxt.

### Nuxt Tests

**Directory:** `test/nuxt/` (config), `test/composables/`, `test/components/`
**Environment:** `nuxt` — full Nuxt runtime with plugins, auto-imports, and simulated DOM (happy-dom).

Use for composables and components that depend on Nuxt features (Vue reactivity, `useRuntimeConfig`, auto-imports).

The Nuxt environment is configured in `vitest.config.ts` with root at `test/nuxt/`, which contains a `nuxt.config.ts` that loads the module from source:

```ts
// test/nuxt/nuxt.config.ts
export default defineNuxtConfig({
  modules: ['../../src/module'],
})
```

Key utilities from `@nuxt/test-utils/runtime`:

- **`mountSuspended(Component, options?)`** — Mounts a Vue component with full Nuxt context (plugins, auto-imports). Returns a `@vue/test-utils` wrapper.
- **`mockNuxtImport(name, factory)`** — Mocks an auto-imported function. Can only be called once per import per file.
- **`mockComponent(name, options)`** — Mocks a Nuxt component by name or path.

#### Composable tests

```ts
import { describe, it, expect } from 'vitest'
import { useQrcode } from '../../src/runtime/composables/use-qrcode'

describe('useQrcode', () => {
  it('generates svg with default options', () => {
    const result = useQrcode('https://example.com')
    expect(result.value).toMatchSnapshot()
  })

  it('accepts custom variant and radius', () => {
    const result = useQrcode('https://example.com', {
      variant: 'rounded',
      radius: 0.5,
    })
    expect(result.value).toMatchSnapshot()
  })
})
```

#### Component tests

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Qrcode from '../../src/runtime/components/qrcode'

describe('Qrcode component', () => {
  it('renders svg output', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: 'https://example.com' },
    })
    expect(wrapper.html()).toContain('<svg')
  })
})
```

**Important:** The Nuxt app is initialized once for all tests. Don't mutate global state, or reset it in `afterEach`.

### E2E Tests

**Directory:** `test/e2e/`
**Environment:** `node` with `setup()` — builds and starts the **playground** app, then sends actual HTTP requests.

Use for testing the module's behavior in a real Nuxt application: server API routes, rendered pages, and the full request/response cycle.

The playground (`playground/`) serves as the e2e target app. It includes:

- **`/api/generate`** (POST) — server-side QR code generation via the server `useQrcode` util.
- **Pages** — `/generate`, `/image`, `/quick`, `/full` — exercise the client-side composables and components.

```ts
import { describe, it, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('playground e2e', async () => {
  await setup({
    rootDir: '../playground',
  })

  it('POST /api/generate returns svg base64', async () => {
    const data = await $fetch('/api/generate', {
      method: 'POST',
      body: { data: 'https://example.com' },
    })
    expect(data).toContain('data:image/svg+xml;base64,')
  })

  it('POST /api/generate rejects missing data', async () => {
    const error = await $fetch('/api/generate', {
      method: 'POST',
      body: {},
    }).catch((e: any) => e)
    expect(error?.statusCode ?? error?.response?.status).toBe(400)
  })

  it('GET /generate renders page', async () => {
    const html = await $fetch('/generate')
    expect(html).toContain('<svg')
  })
})
```

The playground `nuxt.config.ts` should use `$test` to override the production preset with `node-server` when needed for `@nuxt/test-utils` compatibility.

## Snapshots

Composable and unit tests use snapshots (`toMatchSnapshot()`) to catch unintended changes in SVG output. Update snapshots with:

```bash
vitest run --update
```

Review snapshot diffs carefully — they should reflect intentional rendering changes only.

## When to Use Each Type

| What you're testing                       | Type | Why                                     |
| ----------------------------------------- | ---- | --------------------------------------- |
| SVG rendering functions, pure utils       | Unit | Fast, no deps, no Nuxt overhead         |
| Composables (`useQrcode`, `useQrcodeRead`)| Nuxt | Needs Vue reactivity + `useRuntimeConfig` |
| Vue components (`Qrcode`, `QrcodeStream`) | Nuxt | Needs full Nuxt component context       |
| Server utils (`useQrcode` server variant) | E2E  | Needs real Nitro server runtime         |
| API routes (`/api/generate`)              | E2E  | Real HTTP request/response cycle        |
| Rendered pages                            | E2E  | Full SSR output verification            |
