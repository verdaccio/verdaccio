import { describe } from 'vitest';

import { runUnpublish } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('unpublish a package', () => {
  runUnpublish(pnpm);
});
