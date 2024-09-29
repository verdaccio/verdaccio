import { deepEqual } from 'assert';

import { addRegistry } from './utils';

export async function bumbUp(cmd, tempFolder, registry) {
  await cmd({ cwd: tempFolder }, 'version', 'minor', ...addRegistry(registry.getRegistryUrl()));
}

export async function publish(cmd, tempFolder, pkgName, registry, arg: string[] = []) {
  const resp = await cmd(
    { cwd: tempFolder },
    'publish',
    ...arg,
    '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
  const parsedBody = JSON.parse(resp.stdout as string);
  deepEqual(parsedBody.name, pkgName);
}

export async function getInfoVersions(cmd, pkgName, registry) {
  const infoResp = await cmd(
    {},
    'info',
    pkgName,
    '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
  const infoBody = JSON.parse(infoResp.stdout as string);
  return infoBody;
}
