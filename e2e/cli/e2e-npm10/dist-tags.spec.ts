import { describe } from 'vitest';

import { runDistTag } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('dist-tags a package', () => {
  runDistTag(npm);
});
