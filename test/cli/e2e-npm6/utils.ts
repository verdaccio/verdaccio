import { join } from 'path';

import { exec } from '@verdaccio/e2e-cli-commons';

export function getCommand() {
  return join(__dirname, './node_modules/.bin/npm');
}

export function npm(...args: string[]) {
  return exec({}, getCommand(), args);
}
