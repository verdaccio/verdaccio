# Repository Guidelines

## Project Structure & Module Organization

Verdaccio 7.x is a TypeScript npm registry server. Runtime code lives in `src/`: public exports are in `src/index.ts`, CLI and server logic are under `src/lib/`, and shared declarations are under `src/types/`. Tests are organized in `test/unit/`, with reusable infrastructure in `test/helpers/` and `test/lib/`; fixtures belong in `test/unit/partials/`. Default configuration is in `conf/`, local debugging helpers in `debug/`, automation in `scripts/`, and documentation or static material in `docs/`, `wiki/`, and `assets/`. Compiled output is written to `build/` and should not be edited directly.

## Build, Test, and Development Commands

Use the pnpm version declared in `package.json` and Node.js 24 or newer.

- `corepack enable pnpm && pnpm install --frozen-lockfile`: install exact dependencies.
- `pnpm start`: run the registry from TypeScript with the default CLI.
- `pnpm start:debug`: launch the local debug server.
- `pnpm build`: create CommonJS, ESM, and declaration output in `build/`.
- `pnpm test`: run the Vitest suite in the CI environment.
- `pnpm test -- test/unit/modules/api/publish.spec.ts`: run one test file.
- `pnpm type-check`, `pnpm lint`, and `pnpm format:check`: run the required static checks.

## Coding Style & Naming Conventions

Follow `.editorconfig`: use LF endings, a final newline, and two spaces in JavaScript, YAML, and related files. Keep TypeScript modules focused, prefer explicit types at public boundaries, and follow existing naming: kebab-case source files such as `auth-utils.ts`, `*.spec.ts` for unit tests, and descriptive fixture names. Run `pnpm format` (oxfmt) and `pnpm lint:fix` (oxlint) before submitting; avoid hand-editing generated files or `pnpm-lock.yaml`.

## Testing Guidelines

Vitest is configured in `vitest.config.mjs`; coverage uses the V8 provider and includes `src/`. Add or update tests with every behavioral change, place shared setup in `test/unit/__helper/`, and keep test fixtures isolated in `partials/`. Run the focused test while developing, then `pnpm test`, `pnpm type-check`, and `pnpm build` before opening a pull request.

## Commit & Pull Request Guidelines

Use concise Conventional Commit subjects seen in history, for example `fix: reject malformed metadata` or `chore: update dependencies`. Add a Changeset under `.changeset/` for user-visible changes unless the change is documentation or CI-only. Pull requests should explain the problem and solution, link relevant issues, list verification performed, and include screenshots only for UI-visible changes. Never include registry tokens, credentials, or private configuration in commits or bug reports.
