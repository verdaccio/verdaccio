import { SpawnOptions } from 'child_process';
import { join } from 'path';

import { exec } from '@verdaccio/test-cli-commons';
import { addRegistry } from '@verdaccio/test-cli-commons';

export function getCommand() {
  return join(__dirname, './node_modules/.bin/yarn');
}

export function yarn(options: SpawnOptions, ...args: string[]) {
  return exec(options, getCommand(), args);
}

export async function bumbUp(tempFolder, registry) {
  await yarn({ cwd: tempFolder }, 'version', '--minor', ...addRegistry(registry.getRegistryUrl()));
}
