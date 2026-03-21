# TODO

Current and next steps for project-specific implementations.
Remove completed items once they are committed — no need to track history here.

## Testing Setup

- [ ] Update `vitest.config.ts` to support all three test types (unit, nuxt, e2e).
- [ ] Restructure `package.json` scripts: separate `test`, `test:unit`, `test:nuxt`, `test:e2e`, and `test:types` as independent commands (no lint/type-check in `test`).
- [ ] Create `test/unit/` directory with tests for pure SVG rendering functions (`renderSVG`, `renderSVGBase64`, variant helpers, `base64Encode`, etc.).
- [ ] Create `test/e2e/` directory with tests against the playground (API route `/api/generate`, page rendering).
- [ ] Add `$test` preset override in `playground/nuxt.config.ts` for e2e compatibility if needed.
- [ ] Move or reorganize existing composable tests under the nuxt test type.
