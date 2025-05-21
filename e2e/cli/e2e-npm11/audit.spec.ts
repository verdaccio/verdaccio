import { describe } from 'vitest';

import { runAudit } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('audit a package', () => {
  runAudit(npm);
});
