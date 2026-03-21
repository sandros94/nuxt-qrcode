<!-- ⚠️  MAINTENANCE NOTICE
  This file and the `.agents/` folder are the **single source of truth**
  for any AI agent working on this project. They MUST be kept up-to-date
  whenever the project structure, conventions, tooling, or plans change.
  If you change something in the codebase that invalidates information here
  or in any `.agents/` document, update the relevant files in the same PR. -->

## Core Principle — Ask First

**When in doubt, ask before acting.** It is always more important to understand the vision and the request than to assume. There is no shame or wasted time in asking clarifying questions — this applies to every conversation and every task in this project.

## Agent Memory — `.agents/` Folder

The `.agents/` directory is the **memory** of this project for AI agents. It is organized as follows:

### `skills/`

Dependency-specific skills. These are installed or updated by the user and provide framework/library documentation that agents should consult when working with those technologies. Individual skill files are **not** tracked in this document — just know they are available when relevant to the task at hand.

### `contribution/`

Standard approaches, patterns, and implementation guides developed for this project. These documents describe _how_ we build things here.

| File                                                         | Description                                       |
| ------------------------------------------------------------ | ------------------------------------------------- |
| [`contribution/testing.md`](.agents/contribution/testing.md) | Testing strategy, test types, and known patterns. |

### `vision/`

If available use [`vision/IDENTITY.md`](.agents/vision/IDENTITY.md) for project identity, core principles, and high-level goals. Use other vision documents for design and planning information that describes _what_ the project should become in each area. Contents come from external discussions, planned designs, and similar sources. Users may bring documents that need slight adaptation to fit the project context before being stored here.

**Important:** if a technical limitation is discovered during implementation that conflicts with a vision document, **stop and update the vision document first** with a new approach or solution before writing any code. Vision documents are the drawing board — go back to it before implementing workarounds.

### [`TODO.md`](.agents/TODO.md)

Tracks current and next steps for project-specific implementations. Completed items are removed once committed — there is no need to accumulate history of past work.

## First-time Setup for Development

- Run `pnpm install` to install dependencies.
- Run `pnpm dev:prepare` to stub the module and prepare playground/docs type support.

## Key Scripts

- `pnpm dev:prepare` — stubs the module build and prepares the playground and docs for development.
- `pnpm dev` — starts the playground with a dev server.
- `pnpm prepack` — builds the module for publishing.
- `pnpm lint` — lint the codebase.
- `pnpm lint:fix` — automatically fix lint issues.
- `pnpm test` — run all tests.
- `pnpm test:unit` — unit tests only.
- `pnpm test:nuxt` — nuxt environment tests only.
- `pnpm test:e2e` — e2e tests only (builds the playground).
- `pnpm typecheck` — type-check the module, playground, and docs.

Each script is independent — `test` does **not** run lint or type-check.
**Always run** `pnpm lint:fix` and `pnpm typecheck` after making changes.

## Repository Structure

- `.agents/` — Agent memory: skills, contribution guides, vision documents, and TODO.
- `.github/` — GitHub configuration (funding, workflows).
- `src/` — Module source code.
  - `src/module.ts` — Module definition and setup.
  - `src/runtime/` — Runtime code shipped with the module (composables, components, server utils, types, utilities).
- `test/` — Tests (unit, nuxt environment, e2e).
- `playground/` — Nuxt app for manual testing and development of the module. Also used as the target app for e2e tests.
- `docs/` — Documentation site (Nuxt Content).
- `dist/` — Built module output (not committed).

## Testing Strategy

Three test types: **unit** (pure functions, no Nuxt runtime), **nuxt** (composables/components with Nuxt runtime), **e2e** (real HTTP against the built playground). See [`.agents/contribution/testing.md`](.agents/contribution/testing.md) for full documentation.

- `pnpm test` — Run all vitest tests.
- `pnpm test:unit` — Unit tests only.
- `pnpm test:nuxt` — Nuxt environment tests only.
- `pnpm test:e2e` — E2E tests (builds the playground).
- `pnpm typecheck` — Type-check only.

## Development Workflow

### Making Changes

1. Make changes in `src/`.
2. Run `pnpm lint:fix`.
3. Run `pnpm typecheck`.
4. Run `pnpm test`.

## Contribution Principles

- Prefer **minimal, targeted changes** over large refactors.
- Avoid introducing new dependencies unless strictly necessary. Add runtime deps to `dependencies` only if they are needed by consuming apps; otherwise use `devDependencies`.
- Be mindful of **bundle size** — this is a module shipped to users. Check build output with `pnpm prepack`.
- Never modify files outside the scope of the requested change.

## Common Gotchas

- **Don't use runtime-specific APIs** — Module runtime code may run in multiple runtimes (Node, Deno, Bun, workers, edge).
- **Bundle size matters** — Every dependency added to `dependencies` impacts consuming apps.
- **Nuxt version compatibility** — The module targets `nuxt >=3.0.0 || >=4.0.0`. Avoid APIs that only exist in one major version.

## Error & Logging Guidelines

- Prefer explicit errors over silent failures.
- Use warnings for recoverable situations; throw for invalid states.
- Include actionable context in error messages.

## Documentation Requirements

- Update types and JSDoc for API changes.
- Update `docs/content/` when adding or changing public-facing features.

## Code Conventions

- Use **ESM** and modern JavaScript.
- Avoid barrel files (`index.ts` re-exports); import directly from specific modules.
- Place non-exported/internal helpers at the end of the file.
- For multi-arg functions, use an options object as the second parameter.
- Split logic across files; avoid long single-file modules (>200 LoC). Use `_*` prefix for internal files.
- Prefer **Web APIs** over Node.js APIs where possible.
- Do not add comments explaining what the line does unless prompted.
- Before adding new code, study surrounding patterns, naming conventions, and architectural decisions.
- Use existing UnJS utilities and dependencies before adding new packages.
- Keep runtime code minimal and fast.

## Commit Conventions

- Use **semantic commit messages**, lower-case (e.g., `fix(runtime): resolve svg render issue`).
- Prefer to include scope (e.g., `feat(runtime):`, `fix(composables):`, `docs:`, `test:`).
- Add a short description in a new line when helpful.
