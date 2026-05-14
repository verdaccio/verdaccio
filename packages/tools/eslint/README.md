# @verdaccio/eslint-config

Shared ESLint configuration for Verdaccio projects, using ESLint 10 flat config.

## What's included

The default export provides a complete flat config with:

| Layer      | Plugin / Config                 | Description                                               |
| ---------- | ------------------------------- | --------------------------------------------------------- |
| Base JS    | `@eslint/js` recommended        | Core JavaScript rules                                     |
| TypeScript | `typescript-eslint` recommended | Type-aware linting for `.ts` / `.tsx` files               |
| Imports    | `eslint-plugin-import-x`        | Import ordering, deduplication, and resolution            |
| Prettier   | `eslint-config-prettier`        | Disables rules that conflict with Prettier (applied last) |

### Optional exports

The following configs are available as named exports and are **not** enabled by default. Their plugins are declared as **optional `peerDependencies`** — you must install them yourself when using the corresponding config:

| Export            | Plugin (peer dependency)                           | Description                                                    |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `vitestConfig`    | `@vitest/eslint-plugin`                            | Vitest recommended rules for `*.test.*` / `*.spec.*`           |
| `jestConfig`      | `eslint-plugin-jest`                               | Jest recommended rules for `*.test.*` / `*.spec.*`             |
| `reactConfig`     | `eslint-plugin-react`, `eslint-plugin-react-hooks` | React and React Hooks rules for `**/*.{jsx,tsx}`               |
| `cypressConfig`   | `eslint-plugin-cypress`                            | Cypress recommended rules for `cypress/**`                     |
| `verdaccioConfig` | `eslint-plugin-verdaccio`                          | Verdaccio JSX rules (no spread, no style, no className object) |

For example, to use `vitestConfig`:

```bash
pnpm add -D @vitest/eslint-plugin
```

## Installation

```bash
pnpm add -D @verdaccio/eslint-config eslint
```

## Usage

### Basic

Create an `eslint.config.mjs` at your project root:

```js
import verdaccio from '@verdaccio/eslint-config';

export default [
  ...verdaccio,
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
];
```

### With optional configs

```js
import verdaccio, {
  cypressConfig,
  jestConfig,
  reactConfig,
  verdaccioConfig,
  vitestConfig,
} from '@verdaccio/eslint-config';

export default [
  ...verdaccio,
  ...vitestConfig, // or ...jestConfig
  ...reactConfig,
  ...cypressConfig,
  ...verdaccioConfig,
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
];
```

## Key rules

### Code style

- `curly: error` (always require braces)
- `no-console: error` (allow `warn` and `error`)
- `prefer-const`, `no-var`, `prefer-spread`, `prefer-rest-params`

### Import ordering

- Groups: builtin > external > internal > parent > sibling > index
- Newlines between groups, alphabetical within groups

### TypeScript

- `no-unused-vars` (ignores `_` prefixed args)
- `no-floating-promises`, `no-misused-promises`
- `consistent-type-imports`
- `no-explicit-any: warn`

## Global ignores

The shared config ignores these directories by default:

- `__fixtures__`, `partials`, `dist`, `lib`, `build`, `node_modules`

## License

[MIT](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
