/* eslint-disable prefer-promise-reject-errors */
import { fork } from 'child_process';
import path from 'path';
import fs from 'fs';
import buildDebug from 'debug';

import { silentNpm } from './process';

const debug = buildDebug('verdaccio:e2e:registry-utils');

export function createInstallationFolder(tempRootFolder) {
  const verdaccioInstall = path.join(tempRootFolder, 'verdaccio-root-install');
  fs.mkdirSync(verdaccioInstall);
  return verdaccioInstall;
}

export function installVerdaccio(verdaccioInstall) {
  return silentNpm(
    'install',
    '--prefix',
    verdaccioInstall,
    'verdaccio',
    '--registry',
    'http://localhost:6001',
    '--no-package-lock'
  );
}

export async function initialSetup(tempRootFolder, port) {
  // create temporary installation folder
  const verdaccioInstall = createInstallationFolder(tempRootFolder);
  // create a file path for the future the configuration file
  const verdaccioConfigPathOnInstallLocation = path.join(tempRootFolder, 'verdaccio.yaml');
  // install a global verdaccio
  await installVerdaccio(verdaccioInstall);
  // copy the original config verdaccio file
  fs.copyFileSync(
    path.join(__dirname, '../../../packages/config/src/conf/default.yaml'),
    verdaccioConfigPathOnInstallLocation
  );
  // location of verdaccio binary installed in the previous step
  const pathVerdaccioModule = require.resolve('verdaccio/bin/verdaccio', {
    paths: [verdaccioInstall],
  });
  // spawn the registry
  return await spawnRegistry(
    pathVerdaccioModule,
    ['-c', verdaccioConfigPathOnInstallLocation, '-l', port],
    {
      cwd: verdaccioInstall,
      silent: true,
    }
  );
}

export function getVerdaccioPath() {
  const verdaccioPath = path.normalize(
    path.join(process.cwd(), '../../packages/verdaccio/debug/bootstrap.js')
  );

  return verdaccioPath;
}

export function spawnRegistry(verdaccioPath: string, args: string[], childOptions) {
  return new Promise((resolve, reject) => {
    let _childOptions = { silent: true, ...childOptions };
    debug('options %o', _childOptions);
    debug('fork path %o', verdaccioPath);
    const childFork = fork(verdaccioPath, args, _childOptions);

    childFork.on('message', (msg) => {
      debug('message %o', msg);
      if ('verdaccio_started' in msg) {
        resolve(childFork);
      }
    });

    childFork.on('error', (err) => {
      debug('error %o', err);
      reject([err]);
    });
    childFork.on('disconnect', (err) => {
      debug('disconnect %o', err);
      reject([err]);
    });
    childFork.on('exit', (err) => {
      debug('exit %o', err);
      reject([err]);
    });
  });
}
