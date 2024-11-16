import { describe } from 'vitest';

import { runInstall } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('install a project packages', () => {
  runInstall(npm);
});
