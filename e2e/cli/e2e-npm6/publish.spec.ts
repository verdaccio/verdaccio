import { describe } from 'vitest';

import { runPublish } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('publish a package', () => {
  runPublish(npm);
});
