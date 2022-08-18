# @verdaccio/types

TypeScript definitions for Verdaccio plugins and internal code.

### Usage

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

### Run docs

Generate the package types documentation at `./docs` folder.

```bash
 pnpm build:docs
```
