import { describe } from 'vitest';

import { runPing } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('ping registry', () => {
  runPing(pnpm);
});
