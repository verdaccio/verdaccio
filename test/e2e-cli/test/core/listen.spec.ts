import path from 'path';
import fs from 'fs';
import { installVerdaccio } from '../__partials/npm_commands';
import { spawnRegistry } from '../../utils/registry';
import { callRegistry } from '../../utils/web';

describe('npm install', () => {
  jest.setTimeout(90000);
  const port = '9012';

  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-root');
  const verdaccioInstall = path.join(tempRootFolder, 'verdaccio-root-install');
  let registryProcess;
  const configPath = path.join(tempRootFolder, 'verdaccio.yaml');

  beforeAll(async () => {
    await installVerdaccio(verdaccioInstall);
    fs.copyFileSync(path.join(__dirname, '../../config/default.yaml'), configPath);
  });

  test('should match the listing port and load metadata', async () => {
    const pathVerdaccioModule = require.resolve('verdaccio/bin/verdaccio', {
      paths: [verdaccioInstall],
    });

    registryProcess = await spawnRegistry(pathVerdaccioModule, ['-c', configPath, '-l', port], { cwd: verdaccioInstall, silent: true });

    const body = await callRegistry(`http://localhost:${port}/verdaccio`);
    const parsedBody = JSON.parse(body);

    expect(parsedBody.name).toEqual('verdaccio');
  });

  afterAll(async () => {
    registryProcess.kill();
  });
});
