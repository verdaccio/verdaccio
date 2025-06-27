import { SpawnOptions } from 'node:child_process';
import { join } from 'node:path';

import { exec } from '@verdaccio/test-cli-commons';

function getCommand() {
  return join(__dirname, './node_modules/.bin/pnpm');
}

export function pnpm(options: SpawnOptions, ...args: string[]) {
  return exec(options, getCommand(), args);
}
