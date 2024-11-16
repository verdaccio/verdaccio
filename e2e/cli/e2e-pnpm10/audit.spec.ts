import { describe } from 'vitest';

import { runAudit } from '@verdaccio/e2e-cli-pnpm-common';

import { pnpm } from './utils';

describe('audit a package', () => {
  runAudit(pnpm);
});
