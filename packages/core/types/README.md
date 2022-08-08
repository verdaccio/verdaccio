# TypeScript types for Verdaccio

TypeScript definitions for Verdaccio plugins and internal code.

# TypeScript

For usage with the library, the `tsconfig.json` should looks like this.

```json5
// tsconfig.json
{
  compilerOptions: {
    target: 'esnext',
    module: 'commonjs',
    declaration: true,
    noImplicitAny: false,
    strict: true,
    outDir: 'lib',
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    typeRoots: ['./node_modules/@verdaccio/types/lib/verdaccio', './node_modules/@types'],
  },
  include: ['src/*.ts', 'types/*.d.ts'],
}
```

### Imports

```ts
import type {ILocalData, LocalStorage, Logger, Config} from '@verdaccio/types';

class LocalData implements ILocalData {
  path: string;
  logger: Logger;
  data: LocalStorage;
  config: Config;
  locked: boolean;
  ...
}
```
