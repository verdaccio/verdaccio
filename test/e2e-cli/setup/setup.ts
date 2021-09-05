import path from 'path';
import { spawn } from 'child_process';
import buildDebug from 'debug';
import { yellow } from 'kleur';
import { pnpmGlobal } from '../utils/process';
import * as __global from '../utils/global';
import { cleanUpTemp, copyTo, createTempFolder, SETUP_VERDACCIO_PORT } from '../utils/utils';
import { waitOnRegistry } from '../utils/registry';

const debug = buildDebug('verdaccio:e2e:setup');

module.exports = async () => {
  let tempRoot;
  let childProcess;
  try {
    tempRoot = createTempFolder('verdaccio-cli-e2e-');
    debug('dirname folder %o', __dirname);
    debug('temporary folder %o', tempRoot);
    // @ts-ignore
    __global.addItem('dir-root', tempRoot);
    debug(yellow(`Add temp root folder: ${tempRoot}`));
    const destinationConfigFile = path.join(tempRoot, 'verdaccio.yaml');
    debug('destination config file %o', destinationConfigFile);
    copyTo(path.join(__dirname, '../config/_bootstrap_verdaccio.yaml'), destinationConfigFile);
    // @ts-ignore
    global.__namespace = __global;
    debug(`current directory %o`, process.cwd());
    const verdaccioPath = path.normalize(
      path.join(process.cwd(), '../../packages/verdaccio/debug/bootstrap.js')
    );
    debug(process.env.DEBUG);
    debug('verdaccio path %o', verdaccioPath);
    childProcess = spawn(
      process.execPath,
      [verdaccioPath, '-c', './verdaccio.yaml', '-l', SETUP_VERDACCIO_PORT],
      {
        cwd: tempRoot,
        env: {
          DEBUG: 'verdaccio*',
        },
        stdio: 'inherit',
      }
    );
    await waitOnRegistry(SETUP_VERDACCIO_PORT);
    // @ts-ignore
    global.registryProcess = childProcess;
    // publish current build version on local registry
    const rootFolder = path.normalize(path.join(process.cwd(), '../../'));
    debug('root folder %s', rootFolder);
    // install the local changes to verdaccio
    // the published package will be installed from every suite
    await pnpmGlobal(
      rootFolder,
      'publish',
      '--filter',
      ' ./packages',
      '--access',
      'public',
      '--git-checks',
      'false',
      '--registry',
      `http://localhost:${SETUP_VERDACCIO_PORT}`
    );
  } catch (err: any) {
    console.error('error on setup', err);
    if (tempRoot) {
      cleanUpTemp(tempRoot);
    }
    if (childProcess) {
      childProcess.kill();
    }
  }

  process.on('SIGINT', () => {
    cleanUpTemp(tempRoot);
    childProcess.kill();
  });
};
