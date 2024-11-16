import { describe } from 'vitest';

import { runPublish } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('publish a package', () => {
  runPublish(pnpm);
});
