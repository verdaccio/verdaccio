import { SpawnOptions } from 'node:child_process';
import { join } from 'node:path';

import { exec } from '@verdaccio/test-cli-commons';

export function getCommand() {
  return join(__dirname, './node_modules/.bin/npm');
}

export function npm(options: SpawnOptions, ...args: string[]) {
  return exec(options, getCommand(), args);
}
