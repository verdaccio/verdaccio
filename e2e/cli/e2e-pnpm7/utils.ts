import { SpawnOptions } from 'child_process';
import { join } from 'path';

import { exec } from '@verdaccio/test-cli-commons';
import { addRegistry } from '@verdaccio/test-cli-commons';

function getCommand() {
  return join(__dirname, './node_modules/.bin/pnpm');
}

function pnpm(options: SpawnOptions, ...args: string[]) {
  return exec(options, getCommand(), args);
}

async function bumbUp(tempFolder, registry) {
  await pnpm({ cwd: tempFolder }, 'version', 'minor', ...addRegistry(registry.getRegistryUrl()));
}

async function publish(tempFolder, pkgName, registry, arg: string[] = []) {
  const resp = await pnpm(
    { cwd: tempFolder },
    'publish',
    ...arg,
    '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
  const parsedBody = JSON.parse(resp.stdout as string);
  expect(parsedBody.name).toEqual(pkgName);
}

async function getInfoVersions(pkgName, registry) {
  const infoResp = await pnpm(
    {},
    'info',
    pkgName,
    '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
  const infoBody = JSON.parse(infoResp.stdout as string);
  return infoBody;
}

export { getInfoVersions, pnpm, publish, bumbUp };
