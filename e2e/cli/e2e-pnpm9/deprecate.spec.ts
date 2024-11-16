import { describe } from 'vitest';

import { runDeprecate } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('deprecate a package', () => {
  runDeprecate(pnpm);
});
