import { describe } from 'vitest';

import { runInfo } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('info a package', () => {
  runInfo(pnpm);
});
