import { describe } from 'vitest';

import { runSearch } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('search a package', () => {
  runSearch(pnpm);
});
