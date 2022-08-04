import { join } from 'path';

import { exec } from '@verdaccio/test-cli-commons';

export function getCommand(projectFolder) {
  return join(projectFolder, './.yarn/releases/yarn.js');
}

export function getYarnCommand() {
  // TODO: temporary location for yarn bin
  return join(__dirname, './bin/yarn.js');
}

export function yarn(projectFolder, ...args: string[]) {
  return exec({ cwd: projectFolder }, getCommand(projectFolder), args);
}
