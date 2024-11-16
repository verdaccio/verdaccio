import { describe } from 'vitest';

import { runDeprecate } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('deprecate a package', () => {
  runDeprecate(npm);
});
