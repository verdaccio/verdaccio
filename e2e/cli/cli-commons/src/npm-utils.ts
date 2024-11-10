import buildDebug from 'debug';

import { addRegistry } from './utils';

const debug = buildDebug('verdaccio:e2e:npm-utils');
export async function bumbUp(cmd, tempFolder, registry) {
  await cmd({ cwd: tempFolder }, 'version', 'minor', ...addRegistry(registry.getRegistryUrl()));
}

export async function bumpUpPackage(cmd, tempFolder, pkgName, registry, arg: string[] = []) {
  debug('bump up package %o', pkgName);
  await cmd(
    { cwd: tempFolder },
    'version',
    ...arg,
    '--no--git-tag-version',
    '--loglevel=info',
    ...addRegistry(registry.getRegistryUrl())
  );
}

export async function publish(cmd, tempFolder, pkgName, registry, arg: string[] = []) {
  debug('publishing %o', pkgName);
  await cmd(
    { cwd: tempFolder },
    'publish',
    ...arg,
    // '--json',
    ...addRegistry(registry.getRegistryUrl())
  );
}

export async function getInfoVersions(cmd, pkgName, registry) {
  debug('getting info %o', pkgName);
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
