import { join } from 'path';

import { exec } from '@verdaccio/test-cli-commons';

export function getCommand() {
  return join(__dirname, './node_modules/.bin/yarn');
}

export function yarn(...args: string[]) {
  return exec({}, getCommand(), args);
}
