import { describe } from 'vitest';

import { runPing } from '@verdaccio/e2e-cli-npm-common';

import { npm } from './utils';

describe('ping registry', () => {
  runPing(npm);
});
