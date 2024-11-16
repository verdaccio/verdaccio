import { describe } from 'vitest';

import { runUnpublish } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('unpublish a package', () => {
  runUnpublish(npm);
});
