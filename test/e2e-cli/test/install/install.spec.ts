import path from 'path';
import fs from 'fs';
import * as __global from '../../utils/global';
import { spawnRegistry } from '../../utils/registry';
import { execAndWaitForOutputToMatch } from '../../utils/process';
import { installVerdaccio } from '../__partials/npm_commands';
import { expectFileToExist } from '../../utils/expect';

describe('npm install', () => {
  jest.setTimeout(90000);
  const port = '9011';

  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-root');
  const verdaccioInstall = path.join(tempRootFolder, 'verdaccio-root-install');
  let registryProcess;

  beforeAll(async () => {
    await installVerdaccio(verdaccioInstall);

    const configPath = path.join(tempRootFolder, 'verdaccio.yaml');
    fs.copyFileSync(path.join(__dirname, '../../config/default.yaml'), configPath);
    // @ts-ignore
    global.__namespace = __global;
    const pathVerdaccioModule = require.resolve('verdaccio/bin/verdaccio', {
      paths: [verdaccioInstall]
    });
    registryProcess = await spawnRegistry(pathVerdaccioModule, ['-c', configPath, '-l', port], {
      cwd: verdaccioInstall,
      silent: true
    });
  });

  test('should match on npm info verdaccio', async () => {
    // FIXME:  not the best match, looking for a better way to match the terminal output
    const output = await execAndWaitForOutputToMatch(
      'npm',
      ['info', 'verdaccio', '--registry'],
      /A lightweight private npm proxy registry/
    );

    expect(output.ok).toBeTruthy();
  });

  test('should install jquery', async () => {
    const testCwd = path.join(tempRootFolder, '_jquery_');
    await execAndWaitForOutputToMatch(
      'npm',
      ['install', '--prefix', testCwd, 'jquery', '--registry', `http://localhost:${port}`],
      /''/,
      {
        cwd: verdaccioInstall
      }
    );

    const exist = await expectFileToExist(
      path.join(testCwd, 'node_modules', 'jquery', 'package.json')
    );
    expect(exist).toBeTruthy();
  });

  afterAll(async () => {
    registryProcess.kill();
  });
});
