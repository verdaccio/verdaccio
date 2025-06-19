import { SpawnOptions } from 'node:child_process';
import { join } from 'node:path';

import { exec } from '@verdaccio/test-cli-commons';
import { addRegistry } from '@verdaccio/test-cli-commons';

export function getCommand() {
  return join(__dirname, './node_modules/.bin/npm');
}

export function npm(options: SpawnOptions, ...args: string[]) {
  return exec(options, getCommand(), args);
}

export async function bumbUp(tempFolder, registry) {
  await npm({ cwd: tempFolder }, 'version', 'minor', ...addRegistry(registry.getRegistryUrl()));
}

export async function publish(tempFolder, pkgName, registry, arg: string[] = []) {
  const resp = await npm(
    { cwd: tempFolder },
    'publish',
    ...arg,
    '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
  const parsedBody = JSON.parse(resp.stdout as string);
  expect(parsedBody.name).toEqual(pkgName);
}

export async function getInfoVersions(pkgName, registry) {
  const infoResp = await npm(
    {},
    'info',
    pkgName,
    '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
  const infoBody = JSON.parse(infoResp.stdout as string);
  return infoBody;
}
