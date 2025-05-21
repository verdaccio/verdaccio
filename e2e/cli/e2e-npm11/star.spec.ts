import { describe } from 'vitest';

import { runStar } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('star a package', () => {
  runStar(npm);
});
