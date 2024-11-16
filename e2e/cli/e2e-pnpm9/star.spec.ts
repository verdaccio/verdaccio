import { describe } from 'vitest';

import { runStar } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('star a package', () => {
  runStar(pnpm);
});
