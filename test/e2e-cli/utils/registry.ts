/* eslint-disable prefer-promise-reject-errors */
import { ChildProcess, fork } from 'child_process';
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

export function addNpmPrefix(installFolder) {
  return ['--prefix', installFolder];
}

export function addYarnPrefix(installFolder) {
  // info regarding cwd flag
  // https://github.com/yarnpkg/yarn/pull/4174
  return ['--cwd', installFolder];
}

export function addRegistry(port) {
  return ['--registry', `http://localhost:${port}`];
}

export function installVerdaccio(verdaccioInstall) {
  debug('installing verdaccio from internal registry');
  return silentNpm(
    'install',
    ...addNpmPrefix(verdaccioInstall),
    'verdaccio',
    ...addRegistry('6001'),
    // lock file is not useful for this purpose
    '--no-package-lock',
    '-no-shrinkwrap',
    // reduce external calls and potential test failures
    '--no-audit'
  );
}

export type Setup = {
  child: ChildProcess;
  install: string;
};

export async function initialSetup(port: string | number): Promise<Setup> {
  // temp folder created on test_environment.ts
  const tempRootFolder = global.__namespace.getItem('dir-suite-root');
  debug('initial setup on %o and port %o', tempRootFolder, port);
  // create temporary installation folder
  const verdaccioInstall = createInstallationFolder(tempRootFolder);
  debug('install folder %o', verdaccioInstall);
  // create a file path for the future the configuration file
  const verdaccioConfigPathOnInstallLocation = path.join(tempRootFolder, 'verdaccio.yaml');
  debug('config file location %o', verdaccioConfigPathOnInstallLocation);
  // install a global verdaccio
  debug('install verdaccio start');
  await installVerdaccio(verdaccioInstall);
  debug('install verdaccio finish');
  // copy the original config verdaccio file
  fs.copyFileSync(
    path.join(__dirname, '../../../packages/config/src/conf/default.yaml'),
    verdaccioConfigPathOnInstallLocation
  );
  // location of verdaccio binary installed in the previous step
  const pathVerdaccioModule = require.resolve('verdaccio/bin/verdaccio', {
    paths: [verdaccioInstall],
  });
  debug('path verdaccio module %o', pathVerdaccioModule);
  // spawn the registry
  const processChild = await forkRegistry(
    pathVerdaccioModule,
    ['-c', verdaccioConfigPathOnInstallLocation, '-l', port],
    {
      cwd: verdaccioInstall,
      silent: false,
    },
    port
  );

  return {
    child: processChild,
    install: verdaccioInstall,
  };
}

export function getVerdaccioPath() {
  const verdaccioPath = path.normalize(
    path.join(process.cwd(), '../../packages/verdaccio/debug/bootstrap.js')
  );

  return verdaccioPath;
}

export function forkRegistry(
  verdaccioPath: string,
  args: string[],
  childOptions,
  port
): Promise<ChildProcess> {
  debug('spawning registry for %o in port %o', verdaccioPath, port);
  return new Promise((resolve, reject) => {
    let _childOptions = { silent: true, ...childOptions };
    debug('options %o', _childOptions);
    debug('fork path %o', verdaccioPath);
    debug('args %o', args);
    const childFork = fork(verdaccioPath, args, _childOptions);

    childFork.on('message', (msg) => {
      if ('verdaccio_started' in msg) {
        debug('spawning registry [started] in port %o', port);
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
