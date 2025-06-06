import { describe } from 'vitest';

import { runInfo } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('info a package', () => {
  runInfo(npm);
});
