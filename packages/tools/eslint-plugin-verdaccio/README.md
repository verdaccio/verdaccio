# eslint-plugin-verdaccio

Verdaccio code guidelines — custom ESLint rules for JSX best practices.

Compatible with **ESLint 10** flat config and [`@verdaccio/eslint-config`](../eslint/).

## Installation

```bash
pnpm add -D eslint-plugin-verdaccio eslint
```

## Usage

### With `@verdaccio/eslint-config` (recommended)

Add the plugin's recommended flat config alongside `@verdaccio/eslint-config`:

```js
// eslint.config.mjs
import verdaccioPlugin from 'eslint-plugin-verdaccio';

import verdaccio from '@verdaccio/eslint-config';

export default [
  ...verdaccio,
  ...verdaccioPlugin.configs.recommended,
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
];
```

### Standalone

```js
// eslint.config.mjs
import verdaccioPlugin from 'eslint-plugin-verdaccio';

export default [...verdaccioPlugin.configs.recommended];
```

### Custom rule selection

```js
// eslint.config.mjs
import verdaccioPlugin from 'eslint-plugin-verdaccio';

export default [
  {
    plugins: {
      verdaccio: verdaccioPlugin,
    },
    rules: {
      'verdaccio/jsx-spread': 'error',
      'verdaccio/jsx-no-style': 'error',
      'verdaccio/jsx-no-classname-object': 'warn',
    },
  },
];
```

## Supported Rules

- [verdaccio/jsx-spread](docs/rules/jsx-spread.md): Disallow spread operators on JSX elements.
- [verdaccio/jsx-no-style](docs/rules/jsx-no-style.md): Disallow `style` attribute on JSX elements.
- [verdaccio/jsx-no-classname-object](docs/rules/jsx-no-classname-object.md): Disallow object expressions in `className` attribute on JSX elements.

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)
