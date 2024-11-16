import { describe } from 'vitest';

import { runDistTag } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('dist-tags a package', () => {
  runDistTag(pnpm);
});
