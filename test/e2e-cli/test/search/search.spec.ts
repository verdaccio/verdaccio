import path from 'path';
import fs from 'fs';
import * as __global from '../../utils/global';
import { spawnRegistry } from '../../utils/registry';
import { execAndWaitForOutputToMatch } from '../../utils/process';
import { installVerdaccio } from '../__partials/npm_commands';
import { expectFileToExist } from '../../utils/expect';

describe('npm search', () => {
  jest.setTimeout(90000);
  const port = '9012';

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
      paths: [verdaccioInstall],
    });
    registryProcess = await spawnRegistry(pathVerdaccioModule, ['-c', configPath, '-l', port], {
      cwd: verdaccioInstall,
      silent: true,
    });
  });

  test('should match on npm search verdaccio', async () => {
    const output = await execAndWaitForOutputToMatch(
      'npm',
      ['search', 'verdaccio', '--registry', `http://localhost:${port}`],
      /private package repository registry enterprise modules pro/
    );

    expect(output.ok).toBeTruthy();
  });

  afterAll(async () => {
    registryProcess.kill();
  });
});
