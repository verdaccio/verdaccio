import { describe } from 'vitest';

import { runSearch } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('search a package', () => {
  runSearch(npm);
});
