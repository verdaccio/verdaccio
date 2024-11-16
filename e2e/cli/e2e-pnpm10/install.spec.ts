import { describe } from 'vitest';

import { runInstall } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('install a project packages', () => {
  runInstall(pnpm);
});
