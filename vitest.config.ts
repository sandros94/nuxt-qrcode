import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    globals: true,
    silent: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          testTimeout: 1000,
          include: [
            'test/unit/**/*.{test,spec}.ts',
          ],
          environment: 'node',
        },
      },
      await defineVitestProject({
        extends: true,
        test: {
          name: 'nuxt',
          testTimeout: 5000,
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('test/nuxt/', import.meta.url)),
            },
          },
        },
      }),
      {
        extends: true,
        test: {
          name: 'e2e',
          testTimeout: 30000,
          include: ['test/e2e/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
    ],
  },
})
